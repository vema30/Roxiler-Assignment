// models/Store.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const storeSchema = new Schema({
  name: { type: String, required: true },
  email: String,
  address: { type: String, maxlength: 400 },
  owner: { type: Schema.Types.ObjectId, ref: "User", default: null },
}, { timestamps: true });

export default mongoose.model("Store", storeSchema);
