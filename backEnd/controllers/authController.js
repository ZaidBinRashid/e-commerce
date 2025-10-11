import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/pool.js";

// Import the secret key for signing JWT tokens from environment variables.
const JWT_SECRET = process.env.JWT_SECRET;

// ------------------ SIGNUP ------------------
export const signup = async (req, res) => {
  try {
    // Extract the username, email, and password from the request body (sent from frontend).
    // This data usually comes from a signup form.
    const { username, email, password } = req.body;

    // Use bcrypt to hash the user's password before saving it.
    // The "10" is the "salt rounds" — higher numbers increase security but take longer to compute.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the PostgreSQL database.
    // The query uses placeholders ($1, $2, $3) to safely inject user data — this prevents SQL injection attacks.
    // RETURNING returns specific columns of the newly inserted row (id, username, email) to confirm signup success.
    const result = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, hashedPassword]
    );

    // Send the newly created user (without password) as a JSON response to the frontend.
    // "result.rows[0]" contains the first (and only) returned row.
    res.json(result.rows[0]);
  } catch (err) {
    // If any error occurs (e.g., duplicate email, invalid input, or DB failure),
    // log it to the server console for debugging.
    console.error(err);

    // Send a 400 (Bad Request) response to the client with a generic error message.
    // You can refine this message based on the specific error.
    res.status(400).json({ error: "User already exists or invalid data" });
  }
};

// ------------------ LOGIN ------------------
export const login = async (req, res) => {
  try {
    // Extract the email and password from the login form request body.
    const { email, password } = req.body;

    // Query the database to find a user with the given email.
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    // Extract the first result (there should only be one user with that email).
    const user = result.rows[0];

    // If no user is found with that email, return an error.
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare the plain-text password provided by the user with the hashed password in the database.
    // bcrypt.compare() returns true if they match, false if not.
    const isMatch = await bcrypt.compare(password, user.password_hash);

    // If passwords don't match, send an "Invalid credentials" error.
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // If login is successful, create a JSON Web Token (JWT) for the user.
    // The payload contains user information (id, email, role).
    // The token is signed with your secret key and expires in 1 hour.
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Send the JWT to the user's browser as a cookie for authentication.
    // The cookie options:
    // - httpOnly: true → prevents JavaScript access to the cookie (defense against XSS attacks)
    // - secure: true only in production → ensures cookie is sent over HTTPS in production
    // - maxAge: 3600000 ms = 1 hour
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 3600000,
    });

    // Send a success message to the frontend.
    res.json({ message: "Login successful" });
  } catch (err) {
    // If something unexpected happens (DB error, JWT error, etc.),
    // log it and send a 500 (Internal Server Error) to the client.
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ LOGOUT ------------------
export const logOut = async (req, res) => {
  // Clear the 'token' cookie from the user's browser, effectively logging them out.
  res.clearCookie("token");

  // Redirect the user to the login page.
  res.redirect("/login");
};


// ------------------ PROFILE ------------------
export const profile = async (req, res) => {
  try {
    // Use the User ID from the JWT token
    const userId = req.user.id;

    //Fetch the user info from the database
    const result = await pool.query(
      "SELECT id, username, email, role FROM users WHERE id = $1",
      [userId]
    )

    const userInfo = result.rows[0];

    if (!userInfo) return res.status(404).json({ error: "User not found" });

    // Send user info to the frontend (exclude password!)
    res.json(userInfo);
  } catch (error) {
     console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// ------------------ ADMIN ------------------
export const admin = async (req, res) => {
  res.json({ message: "Welcome to the admin panel", user: req.user });
};
