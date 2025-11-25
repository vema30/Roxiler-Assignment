
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
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) return res.status(400).json({ message: "Incorrect password" });

    const hash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hash }
    });

    res.json({ message: "Password updated successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
