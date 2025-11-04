import Razorpay from "razorpay";
import crypto from "crypto";
import pool from "../db/pool.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create Razorpay order and save local order as Pending (with razorpay_order_id).
 * POST /api/payment/create-order
 * Expected body: { full_name, email, phone, address, city, state, pincode, cart, total, shippingCharge }
 */
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
    if (!full_name || !email || !phone || !address || !city || !state || !pincode) {
      return res.status(400).json({ error: "Missing customer or address fields" });
    }
    if (!total || isNaN(Number(total))) {
      return res.status(400).json({ error: "total is required and must be a number" });
    }

    // Razorpay requires amount in paise
    const amountInPaise = Math.round((Number(total) + Number(shippingCharge || 0)) * 100);

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
        [orderId, item.id, item.title, item.quantity || 1, price, JSON.stringify(item.selectedOptions || {})]
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

/**
 * Verify payment signature, update DB order to Paid
 * POST /api/payment/verify
 * Expected body: { razorpay_order_id, razorpay_payment_id, razorpay_signature }
 */
export const verifyPayment = async (req, res) => {
  const client = await pool.connect();
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    console.log("🧾 Incoming verification:", req.body);

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing required payment fields" });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    // Update order: mark Paid and set payment_id
    const updateResult = await client.query(
      `UPDATE orders SET payment_status='Paid', payment_id=$1, order_status='Completed' WHERE razorpay_order_id=$2 RETURNING id`,
      [razorpay_payment_id, razorpay_order_id]
    );

    if (updateResult.rowCount === 0) {
      // No matching order — this shouldn't happen if you saved razorpay_order_id on create
      return res.status(400).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Payment verified and order updated" });
  } catch (err) {
    console.error("❌ Payment verification failed:", err);
    res.status(500).json({ success: false, error: "Verification failed" });
  } finally {
    client.release();
  }
};
