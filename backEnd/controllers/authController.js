import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

const JWT_SECRET = process.env.JWT_SECRET;

// ------------------ SIGNUP ------------------
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into DB
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // only true in prod
      maxAge: 3600000, // 1 hour
    });

    res.json({ message: "Login successful" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ LOGOUT ------------------
export const logOut = async (req, res) => {
  res.clearCookie("token");
  res.redirect("/login");
}

// ------------------ PROFILE ------------------
export const profile = async (req, res) => {
  res.json({ message: "Welcome to your profile", user: req.user });
};

// ------------------ ADMIN ------------------
export const admin = async (req, res) => {
  res.json({ message: "Welcome to the admin panel", user: req.user });
};
