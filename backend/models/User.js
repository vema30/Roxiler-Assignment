// models/User.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true, minlength: 4, maxlength: 60 },
  email: { type: String, required: true, unique: true, lowercase: true },
  passwordHash: { type: String, required: true },
  address: { type: String, maxlength: 400 },
  role: { type: String, enum: ["SYSTEM_ADMIN","NORMAL_USER","STORE_OWNER"], default: "NORMAL_USER" },
}, { timestamps: true });

export default mongoose.model("User", userSchema);
