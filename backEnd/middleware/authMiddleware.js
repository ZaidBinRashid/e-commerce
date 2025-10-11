import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

// ------------------ AUTH MIDDLEWARE ------------------

// This middleware checks whether a user is authenticated (i.e., logged in)
// before allowing them to access protected routes.

// Exporting the function so it can be imported and used in other files.
export function authMiddleware(req, res, next) {
  // Extract the token from cookies.
  // When a user logs in, a JWT (JSON Web Token) was stored as a cookie named "token".
  const token = req.cookies.token;

  // If there is no token, it means the user is not logged in.
  // Return a 401 Unauthorized response and stop execution.
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    // Verify the token using the secret key (same key used to sign i    // jwt.verify() decodes and checks if the token is valid (not expired or tampered with).
    const decoded = jwt.verify(token, JWT_SECRET);

    // If verification succeeds, store the decoded payload in `req.user`.
    // This makes the user's data (id, email, role, etc.) available in later middleware or route handlers.
    req.user = decoded;

    // Call next() to pass control to the next middleware or route.
    next();
  } catch (err) {
    // If verification fails (token expired, invalid, or modified),
    // respond with 401 (Unauthorized) and an error message.
    res.status(401).json({ error: "Invalid token" });
  }
}

// ------------------ ADMIN MIDDLEWARE ------------------

// This middleware checks if the authenticated user has an "admin" role.
// It should be used *after* authMiddleware, since it relies on req.user being set.

export function adminMiddleware(req, res, next) {
  // Check the role property of the user object set by authMiddleware.
  // If the user's role is not "admin", they are not allowed to proceed.
  if (req.user.role !== "admin") {
    // Send a 403 (Forbidden) status code — this means the user is authenticated,
    // but does not have permission to access this resource.
    res.status(403).json({ error: "Forbidden: Admins only" });
  } else {
    // If the user *is* an admin, call next() to continue to the route handler.
    next();
  }
}
