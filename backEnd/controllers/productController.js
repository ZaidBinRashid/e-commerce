import pool from "../db/pool.js";
import multer from "multer";
import path from "path";

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // folder where images are saved
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});

export const upload = multer({ storage });

// ------------------ Add Product (Admin only) ------------------
export const addProduct = async (req, res) => {
  try {
    const { title, description, price } = req.body;
    const imageUrl = `/uploads/${req.file.filename}`;

    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const result = await pool.query(
      "INSERT INTO products (title, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, price, imageUrl]
    );

    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- Delete Product (Admin only) -----------------
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    // check if the product exists
    const check = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    //Delete the product
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// -------------------- Fetch All Products ----------------------
export const allProducts = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM products");

    res.json({ Products: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ----------------- Update Product (Admin only)------------------
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    // 1. Check if the product exists
    const check = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 2. Keep old image if new one not uploaded
    const currentProduct = check.rows[0];
    const finalImageUrl = imageUrl || currentProduct.image_url;

    // 3. Update the product
    const result = await pool.query(
      `UPDATE products 
       SET title = $1, description = $2, price = $3, image_url = $4
       WHERE id = $5
       RETURNING *`,
      [title, description, price, finalImageUrl, id]
    );

    res.json({
      message: "Product updated successfully",
      updatedProduct: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Server error" });
  }
};
