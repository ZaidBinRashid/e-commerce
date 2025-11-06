import pool from "../db/pool.js";
import cloudinary from "../config/cloudinary.js";

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

    // 1️⃣ Add product
    const productResult = await client.query(
      `INSERT INTO products (title, description, detailed_description, base_price, brand, wrist_size)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [title, description, detailed_description, base_price, brand, wrist_size]
    );

    const product = productResult.rows[0];
    const productId = product.id;

    // 2️⃣ Main product images
    if (req.files?.images) {
      for (const file of req.files.images) {
        await client.query(
          `INSERT INTO product_images (product_id, image_url, public_id)
           VALUES ($1, $2, $3)`,
          [productId, file.path, file.filename]
        );
      }
    }

    // 3️⃣ Colors
    if (colors) {
      const colorArray = JSON.parse(colors);
      const colorImages = req.files?.colorImages || [];

      for (let i = 0; i < colorArray.length; i++) {
        const color = colorArray[i];
        const img = colorImages[i]; // ✅ get the actual image file for this color
        const imageFile = img?.path || color.image || null;
        const publicId = img?.filename || null;

        await client.query(
          `INSERT INTO product_colors (product_id, color_name, color_image_url, price_adjustment, public_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [productId, color.name, imageFile, color.price_adjustment || 0, publicId]
        );
      }
    }

    // 4️⃣ Back Types
    if (backs) {
      const backArray = JSON.parse(backs);
      const backImages = req.files?.backImages || [];

      for (let i = 0; i < backArray.length; i++) {
        const back = backArray[i];
        const img = backImages[i];
        const imageFile = img?.path || back.image || null;
        const publicId = img?.filename || null;

        await client.query(
          `INSERT INTO product_back_types (product_id, type_name, image_url, price_adjustment, public_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [productId, back.name, imageFile, back.price_adjustment || 0, publicId]
        );
      }
    }

    // 5️⃣ Wrists
    if (wrists) {
      const wristArray = JSON.parse(wrists);
      const wristImages = req.files?.wristImages || [];

      for (let i = 0; i < wristArray.length; i++) {
        const wrist = wristArray[i];
        const img = wristImages[i];
        const imageFile = img?.path || wrist.image || null;
        const publicId = img?.filename || null;

        await client.query(
          `INSERT INTO product_wrists (product_id, wrist_style, image_url, price_adjustment, public_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [productId, wrist.name, imageFile, wrist.price_adjustment || 0, publicId]
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
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', pc.id, 'name', pc.color_name, 'image', pc.color_image_url, 'price_adjustment', pc.price_adjustment)) FILTER (WHERE pc.id IS NOT NULL), '[]') AS colors,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', pb.id, 'name', pb.type_name, 'image', pb.image_url, 'price_adjustment', pb.price_adjustment)) FILTER (WHERE pb.id IS NOT NULL), '[]') AS back_types,
        COALESCE(json_agg(DISTINCT jsonb_build_object('id', pw.id, 'name', pw.wrist_style, 'image', pw.image_url, 'price_adjustment', pw.price_adjustment)) FILTER (WHERE pw.id IS NOT NULL), '[]') AS wrists
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


// ----------------- Delete Product (Admin only) -----------------
export const deleteProduct = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    // 1️⃣ Check if product exists
    const check = await client.query("SELECT * FROM products WHERE id = $1", [id]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    // 2️⃣ Collect all Cloudinary public_ids from related tables
    const imageTables = [
      { table: "product_images", column: "public_id" },
      { table: "product_colors", column: "public_id" },
      { table: "product_back_types", column: "public_id" },
      { table: "product_wrists", column: "public_id" },
    ];

    let allPublicIds = [];

    for (const { table, column } of imageTables) {
      const result = await client.query(
        `SELECT ${column} FROM ${table} WHERE product_id = $1`,
        [id]
      );

      const ids = result.rows
        .map((r) => r[column])
        .filter((pid) => pid && pid.trim() !== "");

      allPublicIds.push(...ids);
    }

    console.log("🧾 Public IDs to delete:", allPublicIds);

    // 3️⃣ Delete images from Cloudinary (in batches)
    if (allPublicIds.length > 0) {
      try {
        const cloudinaryResponse = await cloudinary.api.delete_resources(allPublicIds);
        console.log("🗑️ Cloudinary delete response:", cloudinaryResponse);
      } catch (cloudErr) {
        console.warn("⚠️ Cloudinary deletion failed:", cloudErr.message);
      }
    }

    // 4️⃣ Delete the product from DB (CASCADE should remove related records)
    await client.query("DELETE FROM products WHERE id = $1", [id]);

    res.json({
      message: "✅ Product and all associated images deleted successfully",
    });
  } catch (err) {
    console.error("❌ Delete Product Error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};



// ----------------- Update Product (Admin only)-----------------
export const updateProduct = async (req, res) => {
  const client = await pool.connect();
  const uploadedImages = []; // Track new uploads for rollback

  try {
    const { id } = req.params;
    let {
      title,
      description,
      detailed_description,
      base_price,
      brand,
      wrist_size,
      colors,
      backs,
      wrists,
      is_new,
      in_stock,
    } = req.body;

    if (typeof is_new === "string") is_new = is_new === "true";
    if (typeof in_stock === "string") in_stock = in_stock === "true";

    // 1️⃣ Check if product exists
    const existing = await client.query("SELECT * FROM products WHERE id = $1", [id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ error: "Product not found" });

    await client.query("BEGIN");

    // Helper: delete old Cloudinary images by product_id
    const deleteOldImages = async (table, column) => {
      const result = await client.query(
        `SELECT public_id FROM ${table} WHERE product_id = $1`,
        [id]
      );
      const publicIds = result.rows.map((r) => r.public_id).filter(Boolean);

      if (publicIds.length > 0) {
        try {
          await cloudinary.api.delete_resources(publicIds);
          console.log(`🗑️ Deleted old ${table} images from Cloudinary`);
        } catch (err) {
          console.warn(`⚠️ Failed deleting from Cloudinary (${table}):`, err.message);
        }
      }
    };

    // Helper: upload image to Cloudinary
    const uploadToCloudinary = async (file, folder) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder,
        public_id: `product-${id}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      });
      uploadedImages.push(result.public_id); // track for rollback
      return { url: result.secure_url, publicId: result.public_id };
    };

    // 2️⃣ Update main product fields
    const updatedProduct = await client.query(
      `UPDATE products
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           detailed_description = COALESCE($3, detailed_description),
           base_price = COALESCE($4, base_price),
           brand = COALESCE($5, brand),
           wrist_size = COALESCE($6, wrist_size),
           is_new = COALESCE($7, is_new),
           in_stock = COALESCE($8, in_stock)
       WHERE id = $9
       RETURNING *`,
      [
        title,
        description,
        detailed_description,
        base_price,
        brand,
        wrist_size,
        is_new,
        in_stock,
        id,
      ]
    );

    // 3️⃣ Replace product images
    if (req.files?.images?.length > 0) {
      await deleteOldImages("product_images", "image_url");
      await client.query("DELETE FROM product_images WHERE product_id = $1", [id]);

      for (const file of req.files.images) {
        const { url, publicId } = await uploadToCloudinary(file, "watch_catalog");
        await client.query(
          `INSERT INTO product_images (product_id, image_url, public_id)
           VALUES ($1, $2, $3)`,
          [id, url, publicId]
        );
      }
    }

    // 4️⃣ Update colors
    if (colors) {
      const colorArray = JSON.parse(colors);
      const colorImages = req.files?.colorImages || [];

      await deleteOldImages("product_colors", "color_image_url");
      await client.query("DELETE FROM product_colors WHERE product_id = $1", [id]);

      for (let i = 0; i < colorArray.length; i++) {
        const c = colorArray[i];
        let url = c.image || null;
        let publicId = null;

        if (colorImages[i]) {
          const upload = await uploadToCloudinary(colorImages[i], "watch_catalog");
          url = upload.url;
          publicId = upload.publicId;
        }

        await client.query(
          `INSERT INTO product_colors (product_id, color_name, color_image_url, price_adjustment, public_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, c.name, url, c.price_adjustment || 0, publicId]
        );
      }
    }

    // 5️⃣ Update back types
    if (backs) {
      const backArray = JSON.parse(backs);
      const backImages = req.files?.backImages || [];

      await deleteOldImages("product_back_types", "image_url");
      await client.query("DELETE FROM product_back_types WHERE product_id = $1", [id]);

      for (let i = 0; i < backArray.length; i++) {
        const b = backArray[i];
        let url = b.image || null;
        let publicId = null;

        if (backImages[i]) {
          const upload = await uploadToCloudinary(backImages[i], "watch_catalog");
          url = upload.url;
          publicId = upload.publicId;
        }

        await client.query(
          `INSERT INTO product_back_types (product_id, type_name, image_url, price_adjustment, public_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, b.name, url, b.price_adjustment || 0, publicId]
        );
      }
    }

    // 6️⃣ Update wrists
    if (wrists) {
      const wristArray = JSON.parse(wrists);
      const wristImages = req.files?.wristImages || [];

      await deleteOldImages("product_wrists", "image_url");
      await client.query("DELETE FROM product_wrists WHERE product_id = $1", [id]);

      for (let i = 0; i < wristArray.length; i++) {
        const w = wristArray[i];
        let url = w.image || null;
        let publicId = null;

        if (wristImages[i]) {
          const upload = await uploadToCloudinary(wristImages[i], "watch_catalog");
          url = upload.url;
          publicId = upload.publicId;
        }

        await client.query(
          `INSERT INTO product_wrists (product_id, wrist_style, image_url, price_adjustment, public_id)
           VALUES ($1, $2, $3, $4, $5)`,
          [id, w.name, url, w.price_adjustment || 0, publicId]
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

    // ❌ Rollback newly uploaded Cloudinary images
    for (const publicId of uploadedImages) {
      try {
        await cloudinary.uploader.destroy(publicId);
        console.log("🗑️ Rolled back Cloudinary upload:", publicId);
      } catch {
        console.warn("⚠️ Failed to clean Cloudinary image:", publicId);
      }
    }

    console.error("❌ Update Product Error:", err);
    res.status(500).json({ error: "Server error" });
  } finally {
    client.release();
  }
};