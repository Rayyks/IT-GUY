import mongoose from "mongoose";
import { formatDate } from "../utils/formatDate.js";

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true },
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
    pickupMethod: {
      type: String,
      enum: ["self-requested", "itguy-scheduled"],
      default: null,
      required: function () {
        return this.method === "pickup";
      },
    },
    pickupStatus: {
      type: String,
      enum: ["pending", "scheduled", "on-the-way", "completed"],
      default: null,
      validate: {
        validator: function (value) {
          return this.method === "pickup" ? !!value : !value;
        },
        message: "Pickup status should only be set for 'pickup' method.",
      },
    },
    clientLocation: {
      type: String,
      required: function () {
        return this.method === "pickup" || this.method === "on-site";
      },
    },
    deliveryMethod: {
      type: String,
      enum: ["self-deliver", "itguy-delivery"],
      default: null,
      required: function () {
        return this.method === "drop-off";
      },
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "preparing", "on-the-way", "arrived", "delivered"],
      default: null,
      validate: {
        validator: function (value) {
          return this.method === "drop-off" &&
            this.deliveryMethod === "itguy-delivery"
            ? !!value
            : !value;
        },
        message:
          "Delivery status should only be set for 'drop-off' with 'itguy-delivery'.",
      },
    },
    scheduleDate: { type: Date, required: true },

    // New fields
    repairStartDate: { type: Date, default: null },
    repairEndDate: { type: Date, default: null },

    totalAmount: { type: Number, default: null },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    paymentMethod: { type: String, required: true },
  },
  { timestamps: true }
);

bookingSchema.pre("save", function (next) {
  if (this.deliveryTracking) {
    this.deliveryTracking.lastUpdated = formatDate(new Date());
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
