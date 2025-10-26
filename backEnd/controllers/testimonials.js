import pool from "../db/pool.js"; // Import database connection pool


// ----------------------- AddTestimonials ----------------------------
export const addTestimonials  = async (req, res) => {
  try {
    const { name, comment } = req.body;

  if (!name || !comment){
    return res.status(400).json({ error: "All fields are required!!" });
  }

  const result  = await pool.query(
    "INSERT INTO testimonials ( name, comment) VALUES ($1, $2) RETURNING *",
    [name, comment]
  );

  res.status(201).json({
    message: "Testimonial added successfully",
    testimonial: result.rows[0],
  })
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }

}

// -------------------- Fetch All Testimonials ----------------------
export const testimonials = async (req, res) => {
  try {
    // Fetch all products from database
    const result = await pool.query("SELECT * FROM testimonials");

    // Send response with all products
    res.json({ testimonials: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" }); // Handle server errors
  }
};

// -------------------------- Delete Testimonials ------------------
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params; // Get testimonials ID from request parameters

    // Check if product exists
    const check = await pool.query("SELECT * FROM testimonials WHERE id = $1", [
      id,
    ]);

    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" }); // If not found, send error response
    }

    // Delete product from database
    await pool.query("DELETE FROM testimonials WHERE id = $1", [id]);

    res.json({ message: "Testimonial deleted successfully" }); // Send success response
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" }); // Handle server errors
  }
}