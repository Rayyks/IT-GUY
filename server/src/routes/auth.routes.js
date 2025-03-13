import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  registerUser,
  loginUser,
  requestAccountDeletion,
  cancelAccountDeletion,
} from "../controller/auth.controller.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Private routes (Require authentication)
router.post("/delete", protect, requestAccountDeletion);
router.post("/cancel-delete", protect, cancelAccountDeletion);

export default router;
