import express from "express";
import { protect, adminOrTech } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
} from "../controller/BOOKING/booking.controller.js";

const router = express.Router();

// 🔹 Create a new booking (User only, with image and video upload)
router.post(
  "/",
  protect,
  upload.fields([{ name: "image" }, { name: "video" }]),
  createBooking
);

// 🔹 Get all bookings for the logged-in user
router.get("/", protect, getUserBookings);

// 🔹 Get a single booking by booking ID
router.get("/:id", protect, getBookingById);

// 🔹 Cancel a booking (User only)
router.put("/:id/cancel", protect, cancelBooking);

export default router;
