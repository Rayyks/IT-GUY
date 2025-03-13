import express from "express";
import { adminOrTech, protect } from "../middlewares/authMiddleware.js";
import {
  getAllBookings,
  updateBookingStatus,
  setTotalAmount,
  cancelBooking,
  confirmPayment,
  refundPayment,
  getAllUsers,
  toggleUserStatus,
} from "../controller/ADMIN/admin.controller.js";

const router = express.Router();

// Get all bookings (Admin/Tech)
router.get("/bookings", protect, adminOrTech, getAllBookings);

// Update booking status (Admin/Tech)
router.put("/bookings/:id/status", protect, adminOrTech, updateBookingStatus);

// Set total amount for a booking (Admin/Tech)
router.put("/bookings/:id/amount", protect, adminOrTech, setTotalAmount);

// Cancel a booking (Admin/Tech)
router.put("/bookings/:id/cancel", protect, adminOrTech, cancelBooking);

// Confirm payment (Admin/Tech)
router.put("/payments/:id/confirm", protect, adminOrTech, confirmPayment);

// Refund failed payment (Admin/Tech)
router.put("/payments/:id/refund", protect, adminOrTech, refundPayment);

// Get all users (Admin only)
router.get("/users", protect, adminOrTech, getAllUsers);

// Activate/Deactivate user (Admin only)
router.put("/users/:id/status", protect, adminOrTech, toggleUserStatus);

export default router;
