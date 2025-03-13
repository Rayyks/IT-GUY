import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      unique: true, // Ensure it's unique
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    method: {
      type: String,
      enum: ["on-site", "drop-off", "pickup"],
      required: true,
    },
    scheduleDate: { type: Date, required: true },
    deliveryMethod: {
      type: String,
      enum: ["self-deliver", "itguy-delivery", null],
      default: null,
    },
    image: { type: String, default: null },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    cancelReason: { type: String, default: null },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
