import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  requestAccountDeletion,
  cancelAccountDeletion,
  requestPasswordReset,
  resetPassword,
} from "../controller/AUTH/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/verify-otp", authLimiter, verifyOTP);
router.post("/resend-otp", authLimiter, resendOTP);

// Private routes (Require authentication)
router.post("/request-password-reset", authLimiter, requestPasswordReset);
router.post("/reset-password", authLimiter, resetPassword);

// Private routes (Require authentication)
router.post("/delete", protect, requestAccountDeletion);
router.post("/cancel-delete", protect, cancelAccountDeletion);

export default router;
