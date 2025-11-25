
import mongoose from "mongoose";
const { Schema } = mongoose;

const ratingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  store: { type: Schema.Types.ObjectId, ref: "Store", required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
}, { timestamps: true });

ratingSchema.index({ user: 1, store: 1 }, { unique: true }); // upsert behavior

export default mongoose.model("Rating", ratingSchema);
