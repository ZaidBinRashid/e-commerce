import pool from "../db/pool.js"

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
      cart,
      total,
      shippingCharge,
    } = req.body;

    if (
      !full_name ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode ||
      !cart ||
      cart.length === 0
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // ✅ Start transaction
    await client.query("BEGIN");

    // ✅ Insert into `orders` table
    const orderResult = await client.query(
      `
      INSERT INTO orders (
        full_name, email, phone, address, city, state, pincode,
        total_amount, shipping_charge, created_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,NOW())
      RETURNING id;
      `,
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
      ]
    );

    const orderId = orderResult.rows[0].id;

    // ✅ Insert each item into `order_items`
    for (const item of cart) {
      const { id: product_id, title, total_price, quantity, selectedOptions } =
        item;

      await client.query(
        `
        INSERT INTO order_items
        (order_id, product_id, product_title, quantity, price, selected_options)
        VALUES ($1, $2, $3, $4, $5, $6)
        `,
        [
          orderId,
          product_id,
          title,
          quantity || 1,
          total_price,
          JSON.stringify(selectedOptions || {}),
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "✅ Order placed successfully!",
      order_id: orderId,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Order creation error:", err);
    res.status(500).json({ error: "Server error while creating order" });
  } finally {
    client.release();
  }
};
