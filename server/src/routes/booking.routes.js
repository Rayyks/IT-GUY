import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";
import {
  createBooking,
  getUserBookings,
  getBookingById,
  cancelBooking,
  rescheduleBooking,
  bookingStatusStream,
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

// 🔹 Reschedule a booking (User only)
router.put("/:bookingId/reschedule", protect, rescheduleBooking);

// 🔹 Live Booking Status Updates (SSE)
router.get("/:id/status-stream", bookingStatusStream);

export default router;
