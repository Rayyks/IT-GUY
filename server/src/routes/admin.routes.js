import express from "express";
import { adminOrTech, protect } from "../middlewares/authMiddleware.js";
import {
  getAllBookings,
  getUserBookById,
  updateBookingStatus,
  setTotalAmount,
  cancelBooking,
  confirmPayment,
  refundPayment,
  getAllUsers,
  toggleUserStatus,
  registerAdmin,
  updateDeliveryStatus,
  updatePickupStatus,
  updateMaxDailyBookings,
} from "../controller/ADMIN/admin.controller.js";

const router = express.Router();

// Register admin (ADMIN WILL BE REGISTERED MANUALLY BY THE DEVELOPER)
router.post("/register", protect, registerAdmin);

// Get all bookings (Admin/Tech)
router.get("/bookings", protect, adminOrTech, getAllBookings);

// Get a single booking by ID (Admin/Tech)
router.get("/bookings/:id", protect, adminOrTech, getUserBookById);

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

// Update delivery status (Admin/Tech)
router.put(
  "/bookings/:id/delivery-status",
  protect,
  adminOrTech,
  updateDeliveryStatus
);

// Update pickup status (Admin/Tech)
router.put(
  "/bookings/:id/pickup-status",
  protect,
  adminOrTech,
  updatePickupStatus
);

// UPDATE MAX DAILY BOOKINGS (Admin only)
router.patch(
  "/bookings/max-daily",
  protect,
  adminOrTech,
  updateMaxDailyBookings
);

export default router;
