import { Client } from "pg";
import "dotenv/config";

const SQL = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                -- unique user ID
    username VARCHAR(50) UNIQUE NOT NULL, -- login name
    email VARCHAR(100) UNIQUE NOT NULL,   -- email
    password_hash TEXT NOT NULL,          -- hashed password
    role VARCHAR(20) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')), 
    is_new BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
  
  UPDATE users SET role = 'admin' WHERE email = 'heritagewatchesco@gmail.com';

  
   CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    detailed_description TEXT NOT NULL,
    brand VARCHAR(50) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL,
    wrist_size VARCHAR(50) NOT NULL,
    is_new BOOLEAN DEFAULT TRUE,
    in_stock BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS product_images (
     id SERIAL PRIMARY KEY,
     product_id INT REFERENCES products(id) ON DELETE CASCADE,
     image_url TEXT NOT NULL,
     public_id TEXT
    );

    CREATE TABLE IF NOT EXISTS product_colors (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      color_name VARCHAR(50) NOT NULL,
      color_image_url TEXT NOT NULL,
      public_id TEXT,
      price_adjustment NUMERIC(10, 2) DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_back_types (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      type_name VARCHAR(50) NOT NULL,
      public_id TEXT,
      image_url TEXT,
      price_adjustment NUMERIC(10, 2) DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS product_wrists (
      id SERIAL PRIMARY KEY,
      product_id INT REFERENCES products(id) ON DELETE CASCADE,
      wrist_style VARCHAR(50) NOT NULL,
      image_url TEXT,
      public_id TEXT,
      price_adjustment NUMERIC(10, 2) DEFAULT 0
    );


    
    CREATE TABLE IF NOT EXISTS testimonials(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      comment VARCHAR(150)  NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
     );

   
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      full_name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20) NOT NULL,
      address TEXT NOT NULL,
      city VARCHAR(100) NOT NULL,
      state VARCHAR(100) NOT NULL,
      pincode VARCHAR(10) NOT NULL,
      total_amount NUMERIC(10,2) NOT NULL,
      shipping_charge NUMERIC(10,2) NOT NULL DEFAULT 0,
      payment_status VARCHAR(20) DEFAULT 'Pending',
      payment_id VARCHAR(255),
      razorpay_order_id VARCHAR(255),
      order_status VARCHAR(20) DEFAULT 'Processing',
      created_at TIMESTAMP DEFAULT NOW()
    );


    CREATE TABLE IF NOT EXISTS order_items (
      id SERIAL PRIMARY KEY,
      order_id INT REFERENCES orders(id) ON DELETE CASCADE,
      product_id INT NOT NULL,
      product_title VARCHAR(255),
      quantity INT DEFAULT 1,
      price NUMERIC(10,2),
      selected_options JSONB,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );


`;

async function main() {
  console.log("Seeding...");

  const client = new Client({
    connectionString: process.env.DB_CONSTRING,
  });

  try {
    await client.connect();
    await client.query(SQL);
    console.log("Users table created (if not exists).");
  } catch (err) {
    console.error("Error seeding database:", err);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

main();
