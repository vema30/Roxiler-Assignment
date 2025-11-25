// backend/routes/admin.users.js
import express from "express";
import User from "../models/User.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * ============================
 *  CREATE USER (ADMIN ONLY)
 * ============================
 * Body:
 *  name, email, address, password, role
 */
router.post("/create-user", authenticate, authorize("SYSTEM_ADMIN"), async (req, res) => {
  try {
    const { name, email, address, password, role } = req.body;

    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "All fields are required" });

    // Hash password
    const bcrypt = await import("bcrypt");
    const passwordHash = await bcrypt.default.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      address,
      passwordHash,
      role
    });

    res.json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error("Admin Create User Error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ============================
 *  GET ALL USERS (ADMIN ONLY)
 * ============================
 * Supports filters: name, email, address, role
 */
router.get("/list", authenticate, authorize("SYSTEM_ADMIN"), async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    const filter = {};

    if (name) filter.name = new RegExp(name, "i");
    if (email) filter.email = new RegExp(email, "i");
    if (address) filter.address = new RegExp(address, "i");
    if (role) filter.role = role;

    const users = await User.find(filter).select("-passwordHash");

    res.json({
      message: "Users Fetched",
      data: users
    });

  } catch (err) {
    console.error("Admin Users List Error:", err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ============================
 *  GET USER DETAILS (ADMIN ONLY)
 * ============================
 */
router.get("/:id", authenticate, authorize("SYSTEM_ADMIN"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-passwordHash")
      .lean();

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({ message: "User Details", user });

  } catch (err) {
    console.error("Admin User Details Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
