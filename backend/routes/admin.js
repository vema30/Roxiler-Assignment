// routes/admin.js

import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import { authenticate, authorize } from "../middlewares/auth.js";
import {
  nameValid,
  emailValid,
  passwordValid,
  addressValid
} from "../utils/validators.js";

const router = express.Router();
router.post("/create-initial-admin", async (req, res) => {
    console.log("hey");
  const bcrypt = await import("bcrypt");
  const passwordHash = await bcrypt.default.hash("Admin@123", 10);

  const admin = await User.create({
    name: "Initial System Administrator",
    email: "admin@gmail.com",
    address: "Hyderabad",
    passwordHash,
    role: "SYSTEM_ADMIN"
  });

  res.json({ message: "Admin created", admin });
});

// Only SYSTEM_ADMIN can create users
router.post("/create-user", authenticate, authorize("SYSTEM_ADMIN"), async (req, res) => {
  const { name, email, address, password, role } = req.body;

  // Allowed roles
  const allowedRoles = ["SYSTEM_ADMIN", "NORMAL_USER", "STORE_OWNER"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  // VALIDATION
  if (!nameValid(name)) return res.status(400).json({ message: "Invalid name" });
  if (!emailValid(email)) return res.status(400).json({ message: "Invalid email" });
  if (!passwordValid(password)) return res.status(400).json({ message: "Invalid password" });
  if (!addressValid(address)) return res.status(400).json({ message: "Invalid address" });

  // Check email exists
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already used" });

  const passwordHash = await bcrypt.hash(password, 10);

  // Create user with selected role
  const user = await User.create({
    name,
    email,
    address,
    passwordHash,
    role
  });

  return res.json({
    message: "User created successfully",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
});

export default router;
