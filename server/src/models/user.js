import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    location: { type: String, default: "" },
    role: { type: String, enum: ["user", "admin", "tech"], default: "user" },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null },
    deletionRequest: {
      reason: { type: String, default: null },
      requestedAt: { type: Date, default: null },
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
