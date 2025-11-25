
import jwt from "jsonwebtoken";
import User from "../models/User.js";
const JWT_SECRET = process.env.JWT_SECRET || "change_this";

export async function authenticate(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ message: "No token" });
  const token = header.split(" ")[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ message: "Invalid token" });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
}

export const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ message: "Forbidden" });
  next();
};
