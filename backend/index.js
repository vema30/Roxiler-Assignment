import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.js";
import adminStoreRoutes from "./routes/admin.stores.js";
import adminUserRoutes from "./routes/admin.users.js";
import ownerRoutes from "./routes/owner.js";
import storeRoutes from "./routes/stores.js";
import admin from './routes/admin.js'
dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/admin", admin);
app.use("/admin/stores", adminStoreRoutes);
app.use("/admin/users", adminUserRoutes);
app.use("/owner", ownerRoutes);
app.use("/stores", storeRoutes);

// Root route
app.get("/", (req, res) => {
  res.send("API running...");
});

// Error handling (fallback)
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
