import express from "express";
import Store from "../models/Store.js";
import User from "../models/User.js";
import Rating from "../models/Rating.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

// CREATE STORE (ADMIN ONLY)
router.post("/", authenticate, authorize("SYSTEM_ADMIN"), async (req, res) => {
  const { name, email, address, ownerId } = req.body;
  const store = await Store.create({ name, email, address, owner: ownerId || null });
  res.json({ store });
});

// ADMIN DASHBOARD (TOTAL COUNTS)
router.get("/dashboard", authenticate, authorize("SYSTEM_ADMIN"), async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStores = await Store.countDocuments();
    const totalRatings = await Rating.countDocuments();

    res.json({
      totalUsers,
      totalStores,
      totalRatings
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.status(500).json({ message: "Server error while fetching dashboard data" });
  }
});

/**
 * GET /admin/stores/list
 * Query params:
 *  - page, limit
 *  - sort (default name), order (asc|desc)
 *  - filterName, filterEmail, filterAddress
 */
router.get("/list", authenticate, authorize("SYSTEM_ADMIN"), async (req, res) => {
  try {
    let { page = 1, limit = 10, sort = "name", order = "asc", filterName = "", filterEmail = "", filterAddress = "" } = req.query;
    page = Math.max(1, parseInt(page));
    limit = Math.max(1, Math.min(100, parseInt(limit)));
    const skip = (page - 1) * limit;
    const sortObj = { [sort]: order === "asc" ? 1 : -1 };

    const filter = {};
    if (filterName) filter.name = { $regex: filterName, $options: "i" };
    if (filterEmail) filter.email = { $regex: filterEmail, $options: "i" };
    if (filterAddress) filter.address = { $regex: filterAddress, $options: "i" };

    // total count
    const total = await Store.countDocuments(filter);

    // fetch stores
    const stores = await Store.find(filter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .lean();

    const storeIds = stores.map(s => s._id);

    // aggregate avg rating & count for these stores
    const agg = await Rating.aggregate([
      { $match: { store: { $in: storeIds } } },
      { $group: { _id: "$store", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    const statsMap = Object.fromEntries(agg.map(a => [String(a._id), { avg: a.avgRating, count: a.count }]));

    const result = stores.map(s => ({
      id: s._id,
      name: s.name,
      email: s.email,
      address: s.address,
      owner: s.owner || null,
      avgRating: statsMap[String(s._id)]?.avg ?? null,
      ratingsCount: statsMap[String(s._id)]?.count ?? 0
    }));

    res.json({
      success: true,
      data: result,
      meta: { page, limit, total }
    });
  } catch (err) {
    console.error("Admin stores list error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
export default router;
