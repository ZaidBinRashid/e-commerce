import pool from "../db/pool.js"; // Import database connection pool
import multer from "multer"; // Import multer for handling file uploads
import path from "path"; // Import path module to work with file paths

// ------------------ Multer Configuration ------------------
// Define storage location and filename format for uploaded images
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"), // Save images in 'uploads' folder
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)), // Unique filename using timestamp + original file extension
});

// Initialize multer upload middleware
export const upload = multer({ storage });

// ------------------ Add Product (Admin only) ------------------
export const addProduct = async (req, res) => {
  try {
    const { title, description, price} = req.body; // Extract product details from request body
    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;


    // Validate input fields
    if (!title || !description || !price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Insert new product into database
    const result = await pool.query(
      "INSERT INTO products (title, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, description, price, imageUrl]
    );

    // Send success response
    res.status(201).json({
      message: "Product added successfully",
      product: result.rows[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" }); // Handle server errors
  }
};

// ----------------- Delete Product (Admin only) -----------------
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from request parameters

    // Check if product exists
    const check = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" }); // If not found, send error response
    }

    // Delete product from database
    await pool.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({ message: "Product deleted successfully" }); // Send success response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" }); // Handle server errors
  }
};

// -------------------- Fetch All Products ----------------------
export const allProducts = async (req, res) => {
  try {
    // Fetch all products from database
    const result = await pool.query("SELECT * FROM products");

    // Send response with all products
    res.json({ products: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" }); // Handle server errors
  }
};

// ----------------- Update Product (Admin only)------------------
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Get product ID from URL params
    const { title, description, price, is_new } = req.body; // Extract fields from body
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null; // If a new image is uploaded, use it; otherwise null

    // 1. Check if the product exists in the database
    const check = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 2. Retain old image if new image is not uploaded
    const currentProduct = check.rows[0];
    const finalImageUrl = imageUrl || currentProduct.image_url;

    // 3. Update product details in the database
    const result = await pool.query(
      `UPDATE products 
       SET title = $1, description = $2, price = $3, image_url = $4, is_new = $5
       WHERE id = $6
       RETURNING *`,
      [title, description, price, finalImageUrl, is_new, id]
    );

    // 4. Send success response with updated product
    res.json({
      message: "Product updated successfully",
      updatedProduct: result.rows[0],
    });
  } catch (err) {
    console.error("Error updating product:", err);
    res.status(500).json({ error: "Server error" }); // Handle server errors
  }
};
