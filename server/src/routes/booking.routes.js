import express from "express";
import { protect, adminOrTech } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  updateBookingStatus,
} from "../controller/booking.controller.js";

const router = express.Router();

// 🔹 Create a new booking (User only, with image upload)
router.post("/", protect, upload.single("image"), createBooking);

// 🔹 Get all bookings for the logged-in user
router.get("/", protect, getUserBookings);

// 🔹 Get a single booking by booking ID
router.get("/:id", protect, getBookingById);

// 🔹 Cancel a booking (User only)
router.put("/:id/cancel", protect, cancelBooking);

// 🔹 Update booking status (Admin/Tech only)
router.put("/:id/status", protect, adminOrTech, updateBookingStatus);

export default router;
