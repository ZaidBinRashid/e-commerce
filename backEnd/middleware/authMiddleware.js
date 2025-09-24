import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET;

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}
export function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    res.status(403).json({ error: "Forbidden: Admins only" });
  } else {
    next();
  }
}
