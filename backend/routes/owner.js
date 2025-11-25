import express from "express";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = express.Router();

/**
 * GET /owner/dashboard
 * Protected: STORE_OWNER
 */
router.get("/dashboard", authenticate, authorize("STORE_OWNER"), async (req, res) => {
  try {
    // find stores owned by the logged-in owner
    const stores = await Store.find({ owner: req.user._id }).lean();
    if (!stores.length) return res.json({ success: true, data: [] });

    const storeIds = stores.map(s => s._id);

    // get ratings for these stores
    const ratings = await Rating.find({ store: { $in: storeIds } })
      .populate("user", "name email address")
      .lean();

    // aggregate avg per store
    const agg = await Rating.aggregate([
      { $match: { store: { $in: storeIds } } },
      { $group: { _id: "$store", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);

    const avgMap = Object.fromEntries(agg.map(a => [String(a._id), { avg: a.avgRating, count: a.count }]));

    const out = stores.map(s => ({
      id: s._id,
      name: s.name,
      address: s.address,
      avgRating: avgMap[String(s._id)]?.avg ?? null,
      ratingsCount: avgMap[String(s._id)]?.count ?? 0,
      ratings: ratings.filter(r => String(r.store) === String(s._id)).map(r => ({
        id: r._id,
        rating: r.rating,
        comment: r.comment,
        user: r.user,
        createdAt: r.createdAt
      }))
    }));

    res.json({ success: true, data: out });
  } catch (err) {
    console.error("Owner dashboard error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
