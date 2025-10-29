import pool from "../db/pool.js"; // Import database connection pool
import multer from "multer"; // Import multer for handling file uploads
import path from "path"; // Import path module to work with file paths

// ------------------ Multer Configuration ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

export const upload = multer({ storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error("Invalid file type. Only JPG, PNG allowed!"), false);
    } else {
      cb(null, true);
    }
  },
}).fields([
  { name: "images", maxCount: 10 }, // product images
  { name: "colorImages", maxCount: 10 },
  { name: "backImages", maxCount: 10 },
  { name: "wristImages", maxCount: 10 },
 ]);

// ------------------ Add Product (Admin only) ------------------
export const addProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      title,
      description,
      detailed_description,
      base_price,
      brand,
      wrist_size,
      colors,
      backs,
      wrists,
    } = req.body;

    if (!title || !description || !detailed_description || !base_price) {
      return res.status(400).json({ error: "All fields are required" });
    }

    await client.query("BEGIN");

    // 1️⃣ Add main product
    const productResult = await client.query(
      `INSERT INTO products (title, description, detailed_description, base_price, brand, wrist_size)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, detailed_description, base_price, brand, wrist_size]
    );

    const product = productResult.rows[0];
    const productId = product.id;

    // 2️⃣ Upload main product images
    if (req.files?.images) {
      for (const file of req.files.images) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
          [productId, `/uploads/${file.filename}`]
        );
      }
    }

    // 3️⃣ Colors
    if (colors) {
      const colorArray = JSON.parse(colors);
      const colorImages = req.files?.colorImages || [];
      for (let i = 0; i < colorArray.length; i++) {
        const color = colorArray[i];
        const imageFile = colorImages[i]?.filename
          ? `/uploads/${colorImages[i].filename}`
          : color.image || null;

        await client.query(
          `INSERT INTO product_colors (product_id, color_name, color_image_url, price_adjustment)
           VALUES ($1, $2, $3, $4)`,
          [productId, color.name, imageFile, color.price_adjustment || 0]
        );
      }
    }

    // 4️⃣ Back Types
    if (backs) {
      const backArray = JSON.parse(backs);
      const backImages = req.files?.backImages || [];
      for (let i = 0; i < backArray.length; i++) {
        const back = backArray[i];
        const imageFile = backImages[i]?.filename
          ? `/uploads/${backImages[i].filename}`
          : back.image || null;

        await client.query(
          `INSERT INTO product_back_types (product_id, type_name, image_url, price_adjustment)
           VALUES ($1, $2, $3, $4)`,
          [productId, back.name, imageFile, back.price_adjustment || 0]
        );
      }
    }

    // 5️⃣ Wrists
    if (wrists) {
      const wristArray = JSON.parse(wrists);
      const wristImages = req.files?.wristImages || [];
      for (let i = 0; i < wristArray.length; i++) {
        const wrist = wristArray[i];
        const imageFile = wristImages[i]?.filename
          ? `/uploads/${wristImages[i].filename}`
          : wrist.image || null;

        await client.query(
          `INSERT INTO product_wrists (product_id, wrist_style, image_url, price_adjustment)
           VALUES ($1, $2, $3, $4)`,
          [productId, wrist.name, imageFile, wrist.price_adjustment || 0]
        );
      }
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "✅ Product added successfully",
      product,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Add Product Error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};


// ---------------------- Get Product by ID ---------------------
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `
      SELECT 
        p.*,
        COALESCE(json_agg(DISTINCT pi.image_url) FILTER (WHERE pi.id IS NOT NULL), '[]') AS images,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', pc.id, 'name', pc.color_name, 'image', pc.color_image_url, 'extra', pc.price_adjustment)) FILTER (WHERE pc.id IS NOT NULL), '[]') AS colors,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', pb.id, 'name', pb.type_name, 'image', pb.image_url, 'extra', pb.price_adjustment)) FILTER (WHERE pb.id IS NOT NULL), '[]') AS back_types,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', pw.id, 'name', pw.wrist_style, 'image', pw.image_url, 'extra', pw.price_adjustment)) FILTER (WHERE pw.id IS NOT NULL), '[]') AS wrists
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN product_colors pc ON p.id = pc.product_id
      LEFT JOIN product_back_types pb ON p.id = pb.product_id
      LEFT JOIN product_wrists pw ON p.id = pw.product_id
      WHERE p.id = $1
      GROUP BY p.id
      `,
      [id]
    );

    if (result.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    res.json({ product: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
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
    const result = await pool.query(`
      SELECT 
        p.*, 
        COALESCE(
          json_agg(DISTINCT pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL),
          '[]'
        ) AS images
      FROM products p
      LEFT JOIN product_images pi ON p.id = pi.product_id
      GROUP BY p.id
      ORDER BY p.created_at DESC;
    `);

    res.status(200).json({ products: result.rows });
  } catch (err) {
    console.error("❌ Error fetching all products:", err);
    res.status(500).json({ error: "Server error" });
  }
};


// ----------------- Update Product (Admin only)------------------
export const updateProduct = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id } = req.params;
    const {
      title,
      description,
      detailed_description,
      base_price,
      brand,
      wrist_size,
      colors,
      backs,
      wrists,
    } = req.body;

    // check if product exists
    const existing = await client.query("SELECT * FROM products WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    await client.query("BEGIN");

    // ✅ 1. Update main product info
    const updatedProduct = await client.query(
      `UPDATE products
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           detailed_description = COALESCE($3, detailed_description),
           base_price = COALESCE($4, base_price),
           brand = COALESCE($5, brand),
           wrist_size = COALESCE($6, wrist_size)
       WHERE id = $7
       RETURNING *`,
      [title, description, detailed_description, base_price, brand, wrist_size, id]
    );

    // ✅ 2. Replace product images if new ones uploaded
    if (req.files?.images?.length > 0) {
      await client.query("DELETE FROM product_images WHERE product_id = $1", [id]);
      for (const file of req.files.images) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url) VALUES ($1, $2)`,
          [id, `/uploads/${file.filename}`]
        );
      }
    }

    // ✅ 3. Update colors (replace all if sent)
    if (colors) {
      const colorArray = JSON.parse(colors);
      const colorImages = req.files?.colorImages || [];
      await client.query("DELETE FROM product_colors WHERE product_id = $1", [id]);

      for (let i = 0; i < colorArray.length; i++) {
        const c = colorArray[i];
        const imageFile =
          colorImages[i]?.filename
            ? `/uploads/${colorImages[i].filename}`
            : c.image || null;

        await client.query(
          `INSERT INTO product_colors (product_id, color_name, color_image_url, price_adjustment)
           VALUES ($1, $2, $3, $4)`,
          [id, c.name, imageFile, c.price_adjustment || 0]
        );
      }
    }

    // ✅ 4. Update back types
    if (backs) {
      const backArray = JSON.parse(backs);
      const backImages = req.files?.backImages || [];
      await client.query("DELETE FROM product_back_types WHERE product_id = $1", [id]);

      for (let i = 0; i < backArray.length; i++) {
        const b = backArray[i];
        const imageFile =
          backImages[i]?.filename
            ? `/uploads/${backImages[i].filename}`
            : b.image || null;

        await client.query(
          `INSERT INTO product_back_types (product_id, type_name, image_url, price_adjustment)
           VALUES ($1, $2, $3, $4)`,
          [id, b.name, imageFile, b.price_adjustment || 0]
        );
      }
    }

    // ✅ 5. Update wrists
    if (wrists) {
      const wristArray = JSON.parse(wrists);
      const wristImages = req.files?.wristImages || [];
      await client.query("DELETE FROM product_wrists WHERE product_id = $1", [id]);

      for (let i = 0; i < wristArray.length; i++) {
        const w = wristArray[i];
        const imageFile =
          wristImages[i]?.filename
            ? `/uploads/${wristImages[i].filename}`
            : w.image || null;

        await client.query(
          `INSERT INTO product_wrists (product_id, wrist_style, image_url, price_adjustment)
           VALUES ($1, $2, $3, $4)`,
          [id, w.name, imageFile, w.price_adjustment || 0]
        );
      }
    }

    await client.query("COMMIT");

    res.status(200).json({
      message: "✅ Product updated successfully",
      product: updatedProduct.rows[0],
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("❌ Update Product Error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};

// export const updateProduct = async (req, res) => {
//   try {
//     const { id } = req.params;
//     let { title, description, price, is_new } = req.body;

//     // Convert is_new from string ("true"/"false") to boolean
//     if (typeof is_new === "string") {
//       is_new = is_new === "true";
//     }

//     // Check if product exists
//     const existing = await pool.query("SELECT * FROM products WHERE id = $1", [id]);
//     if (existing.rows.length === 0) {
//       return res.status(404).json({ error: "Product not found" });
//     }

//     const current = existing.rows[0];

//     // Use new image if uploaded, else keep old one
//     let imageUrl = current.image_url;
//     if (req.file) {
//       imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
//     }

//     // Optional: simple field validation
//     if (!title || !description || !price) {
//       return res.status(400).json({ error: "Title, description, and price are required" });
//     }

//     // Update product
//     const result = await pool.query(
//       `UPDATE products 
//        SET title = $1, description = $2, price = $3, image_url = $4, is_new = $5 
//        WHERE id = $6 
//        RETURNING *`,
//       [title, description, price, imageUrl, is_new, id]
//     );

//     // Send response
//     res.json({
//       message: " Product updated successfully",
//       updatedProduct: result.rows[0],
//     });
//   } catch (err) {
//     console.error(" Error updating product:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

