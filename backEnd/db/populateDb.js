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
  
  UPDATE users SET role = 'admin' WHERE email = 'zaidbinrashid85@gmail.com';
  
 CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

    );
    
    CREATE TABLE IF NOT EXISTS testimonials(
      id SERIAL PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      comment VARCHAR(150)  NOT NULL,
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
