import Razorpay from "razorpay";
import crypto from "crypto";
import pool from "../db/pool.js";
import { transporter } from "../config/mailer.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createOrder = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      full_name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      cart = [],
      total,
      shippingCharge = 0,
    } = req.body;

    // Basic validation
    if (
      !full_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res
        .status(400)
        .json({ error: "Missing customer or address fields" });
    }
    if (!total || isNaN(Number(total))) {
      return res
        .status(400)
        .json({ error: "total is required and must be a number" });
    }

    // Razorpay requires amount in paise
    const amountInPaise = Math.round(
      (Number(total) + Number(shippingCharge || 0)) * 100
    );

    // 1) Create order on Razorpay
    const options = {
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    // 2) Save order in our DB (Pending)
    await client.query("BEGIN");

    const orderInsert = await client.query(
      `INSERT INTO orders (
         full_name, email, phone, address, city, state, pincode,
         total_amount, shipping_charge, payment_status, razorpay_order_id, order_status, created_at
       ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'Pending',$10,'Processing',NOW())
       RETURNING id`,
      [
        full_name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        total,
        shippingCharge,
        razorpayOrder.id,
      ]
    );

    const orderId = orderInsert.rows[0].id;

    // 3) Insert order_items (with price)
    for (const item of cart) {
      // adapt to your cart shape: use item.price or item.total_price as needed
      const price = item.price ?? item.total_price ?? 0; // fallback
      await client.query(
        `INSERT INTO order_items (order_id, product_id, product_title, quantity, price, selected_options)
         VALUES ($1,$2,$3,$4,$5,$6)`,
        [
          orderId,
          item.id,
          item.title,
          item.quantity || 1,
          price,
          JSON.stringify(item.selectedOptions || {}),
        ]
      );
    }

    await client.query("COMMIT");

    // 4) Return Razorpay order data and our local order id
    res.json({
      success: true,
      razorpay: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
      },
      orderId: orderId,
      key: process.env.RAZORPAY_KEY_ID,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Error creating order:", err);
    res.status(500).json({ error: "Failed to create order" });
  } finally {
    client.release();
  }
};

export const verifyPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    console.log("🧾 Incoming verification:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required payment fields" });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // Update order: mark Paid and set payment_id
    const updateResult = await client.query(
      `UPDATE orders SET payment_status='Paid', payment_id=$1, order_status='Completed' WHERE razorpay_order_id=$2 RETURNING *`,
      [razorpay_payment_id, razorpay_order_id]
    );

    if (updateResult.rowCount === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Order not found" });
    }

    const order = updateResult.rows[0];

    // Fetch items for this order
    const itemsResult = await client.query(
      `SELECT * FROM order_items WHERE order_id=$1`,
      [order.id]
    );
    const items = itemsResult.rows;

    // Format order details (for email)
    const orderDetails = items
      .map((item) => {
        const opts = item.selected_options || {};

        // Build human-readable option details
        const optionDetails = Object.entries(opts)
          .map(([key, opt]) => {
            if (opt && typeof opt === "object") {
              return `${key.charAt(0).toUpperCase() + key.slice(1)}: ${
                opt.name
              } (+₹${opt.price_adjustment})`;
            }
            return `${key}: ${opt}`;
          })
          .join("<br>");

        return `
      <div style="margin-bottom:10px;">
        <b>${item.product_title}</b> x ${item.quantity} — ₹${item.price}<br>
        ${optionDetails ? `<small>${optionDetails}</small>` : ""}
      </div>
    `;
      })
      .join("");

    await transporter.sendMail({
      from: `"Heritage Watches Co." <${process.env.ADMIN_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `🛒 New Order Received — ${order.full_name}`,
      html: `
    <div style="font-family: Arial, sans-serif; background-color:#f7f7f7; padding:20px;">
      <div style="max-width:600px; background:#fff; margin:auto; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color:#222;">🛍️ New Order Received</h2>
        <p style="font-size:15px;">A new order has been placed on <b>Heritage Watches Co.</b></p>
        
        <h3 style="color:#333;">📦 Customer Details</h3>
        <p><b>Name:</b> ${order.full_name}<br>
        <b>Email:</b> ${order.email}<br>
        <b>Phone:</b> ${order.phone}<br>
        <b>Address:</b> ${order.address}, ${order.city}, ${order.state}, ${order.pincode}</p>
        
        <h3 style="color:#333;">🧾 Order Summary</h3>
        ${orderDetails}

        <p style="font-size:16px; margin-top:10px;"><b>Total Amount:</b> ₹${order.total_amount}</p>

        <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;">
        <p style="font-size:13px; color:#888;">This is an automated notification from the Heritage Watches Co. system.</p>
      </div>
    </div>
  `,
    });

    await transporter.sendMail({
      from: `"Heritage Watches Co." <${process.env.ADMIN_USER}>`,
      to: order.email,
      subject:
        "✅ Order Confirmed — Thank You for Shopping with Heritage Watches Co.",
      html: `
    <div style="font-family: Arial, sans-serif; background-color:#f7f7f7; padding:20px;">
      <div style="max-width:600px; background:#fff; margin:auto; padding:20px; border-radius:10px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
        <h2 style="color:#222;">Thank You for Your Order, ${order.full_name}!</h2>
        <p style="font-size:15px;">We’re delighted to let you know that your payment has been received successfully. Your order is now being prepared for shipment.</p>

        <h3 style="color:#333;">🧾 Order Summary</h3>
        ${orderDetails}

        <p style="font-size:16px; margin-top:10px;"><b>Total Paid:</b> ₹${order.total_amount}</p>

        <h3 style="color:#333;">🚚 What Happens Next?</h3>
        <p>Our team is carefully packing your watch(es). You’ll receive a tracking email once your order has been shipped.</p>

        <p>If you have any questions, simply reply to this email or reach us at <a href="mailto:${process.env.ADMIN_EMAIL}">${process.env.ADMIN_EMAIL}</a>.</p>

        <br>
        <p style="font-size:14px;">Warm regards,<br><b>Heritage Watches Co.</b><br>
        <a href="https://heritagewatchesco.vercel.app" style="color:#0077cc; text-decoration:none;">heritagewatchesco.com</a></p>

        <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;">
        <p style="font-size:12px; color:#888;">This is an automated email confirmation. Please do not reply directly.</p>
      </div>
    </div>
  `,
    });

    res.json({ success: true, message: "Payment verified and order updated" });
  } catch (err) {
    console.error("❌ Payment verification failed:", err);
    res.status(500).json({ success: false, error: "Verification failed" });
  } finally {
    client.release();
  }
};
