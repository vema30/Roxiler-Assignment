// routes/stores.js
import express from "express";
import Store from "../models/Store.js";
import Rating from "../models/Rating.js";
import { authenticate ,authorize} from "../middlewares/auth.js";

const router = express.Router();

// Query: searchName, searchAddress, sort, order, page, limit
router.get("/", authenticate, async (req, res) => {
  const { searchName = "", searchAddress = "", sort = "name", order = "asc", page = 1, limit = 10 } = req.query;
  const skip = (page - 1) * limit;

  // find stores with filters
  const filter = {
    name: { $regex: searchName, $options: "i" },
    address: { $regex: searchAddress, $options: "i" }
  };

  // basic list
  const stores = await Store.find(filter)
    .sort({ [sort]: order === "asc" ? 1 : -1 })
    .skip(skip).limit(Number(limit));

  // For each store compute average rating and user's rating (batch queries preferred)
  const storeIds = stores.map(s => s._id);
  const agg = await Rating.aggregate([
    { $match: { store: { $in: storeIds } } },
    { $group: { _id: "$store", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);

  const avgMap = Object.fromEntries(agg.map(a => [String(a._id), { avg: a.avgRating, count: a.count }]));

  // user-specific ratings
  const userRatings = await Rating.find({ store: { $in: storeIds }, user: req.user._id });
  const userMap = Object.fromEntries(userRatings.map(r => [String(r.store), r.rating]));

  const result = stores.map(s => ({
    id: s._id,
    name: s.name,
    address: s.address,
    email: s.email,
    avgRating: avgMap[String(s._id)]?.avg ?? null,
    ratingsCount: avgMap[String(s._id)]?.count ?? 0,
    userRating: userMap[String(s._id)] ?? null
  }));

  res.json({ stores: result });
});

router.get("/owner/dashboard", authenticate, authorize("STORE_OWNER"), async (req, res) => {
  // find stores owned by this owner
  const stores = await Store.find({ owner: req.user._id });
  const storeIds = stores.map(s => s._id);

  const ratings = await Rating.find({ store: { $in: storeIds } }).populate("user", "name email address");
  // compute average per store
  const agg = await Rating.aggregate([
    { $match: { store: { $in: storeIds } } },
    { $group: { _id: "$store", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
  ]);
  const avgMap = Object.fromEntries(agg.map(a => [String(a._id), a]));

  const out = stores.map(s => ({
    storeId: s._id,
    name: s.name,
    avgRating: avgMap[String(s._id)]?.avgRating ?? null,
    ratings: ratings.filter(r => String(r.store) === String(s._id)).map(r => ({
      user: r.user,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt
    }))
  }));
  res.json({ stores: out });
});
router.get("/", authenticate, async (req, res) => {
  try {
    const stores = await Store.find().lean();
    const storeIds = stores.map((s) => s._id);

    // aggregate avg rating and count
    const agg = await Rating.aggregate([
      { $match: { store: { $in: storeIds } } },
      { $group: { _id: "$store", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } }
    ]);
    const aggMap = Object.fromEntries(agg.map(a => [String(a._id), { avg: a.avgRating, count: a.count }]));

    // current user's ratings
    const userRatings = await Rating.find({ user: req.user._id }).lean();
    const userMap = Object.fromEntries(userRatings.map(r => [String(r.store), r.rating]));

    const result = stores.map(s => ({
      id: s._id,
      name: s.name,
      email: s.email,
      address: s.address,
      owner: s.owner || null,
      avgRating: aggMap[String(s._id)]?.avg ?? null,
      ratingCount: aggMap[String(s._id)]?.count ?? 0,
      userRating: userMap[String(s._id)] ?? null
    }));

    return res.json({ stores: result });
  } catch (err) {
    console.error("Store list error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * POST /stores/rate
 * Body: { storeId, rating, comment? }
 * Creates or updates a user's rating for the store. Rating must be 1-5.
 */
router.post("/rate", authenticate, async (req, res) => {
  try {
    const { storeId, rating, comment } = req.body;

    if (!storeId) return res.status(400).json({ message: "Missing storeId" });
    if (typeof rating !== "number" && typeof rating !== "string") return res.status(400).json({ message: "Missing rating" });

    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ message: "Rating must be an integer between 1 and 5" });
    }

    // ensure store exists
    const store = await Store.findById(storeId);
    if (!store) return res.status(404).json({ message: "Store not found" });

    // upsert: if user already rated, update; otherwise create
    const existing = await Rating.findOne({ store: storeId, user: req.user._id });

    if (existing) {
      existing.rating = ratingNum;
      if (typeof comment === "string") existing.comment = comment;
      await existing.save();
      return res.json({ message: "Rating updated", rating: { id: existing._id, rating: existing.rating } });
    }

    const newRating = await Rating.create({
      store: storeId,
      user: req.user._id,
      rating: ratingNum,
      comment: typeof comment === "string" ? comment : undefined
    });

    return res.json({ message: "Rating submitted", rating: { id: newRating._id, rating: newRating.rating } });
  } catch (err) {
    console.error("Rate store error:", err);
    // handle unique index violation gracefully
    if (err.code === 11000) {
      return res.status(409).json({ message: "You have already rated this store" });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

/**
 * GET /stores/:id/ratings
 * Return all ratings for a store (populates user name/email)
 */
router.get("/:id/ratings", authenticate, async (req, res) => {
  try {
    const storeId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(storeId)) return res.status(400).json({ message: "Invalid store id" });

    const ratings = await Rating.find({ store: storeId })
      .populate({ path: "user", select: "name email address" })
      .sort({ createdAt: -1 })
      .lean();

    return res.json({ ratings });
  } catch (err) {
    console.error("Get store ratings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;