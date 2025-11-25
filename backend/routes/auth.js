
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { nameValid, emailValid, passwordValid } from "../utils/validators.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "change_this";

router.post("/register", async (req, res) => {
  const { name, email, address, password } = req.body;
  console.log(typeof(name));

  if (!nameValid(name)) return res.status(400).json({ message: "Invalid name" });
  if (!emailValid(email)) return res.status(400).json({ message: "Invalid email" });
  if (!passwordValid(password)) return res.status(400).json({ message: "Invalid password" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, address, passwordHash, role: "NORMAL_USER" });
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
  res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
});
// POST /auth/update-password
router.post("/update-password", authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new passwords are required" });
    }

    // Optional: validate new password strength using your helper
    if (!passwordValid(newPassword)) {
      return res.status(400).json({ message: "New password does not meet requirements" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare with stored hash field (you use passwordHash in registration/login)
    const match = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!match) return res.status(400).json({ message: "Current password is incorrect" });

    const newHash = await bcrypt.hash(newPassword, 10);
    user.passwordHash = newHash;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error("update-password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
