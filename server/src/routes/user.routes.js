import express from "express";
import {
  getUserProfile,
  logoutUser,
  updateUserProfile,
  getUserFixHistory,
  getFixStatus,
} from "../controller/user.controller.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

// Get user profile
router.get("/profile", protect, getUserProfile);

// Logout user (Blacklist token)
router.post("/logout", protect, logoutUser);

// Update user profile
router.put("/update", protect, updateUserProfile);

// Get fix history (past and ongoing repairs)
router.get("/fix-history", protect, getUserFixHistory);

// Get repair booking status
router.get("/fix-status/:bookingId", protect, getFixStatus);

export default router;
