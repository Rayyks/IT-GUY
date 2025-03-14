import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  requestAccountDeletion,
  cancelAccountDeletion,
} from "../controller/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);

// Private routes (Require authentication)
router.post("/delete", protect, requestAccountDeletion);
router.post("/cancel-delete", protect, cancelAccountDeletion);

export default router;
