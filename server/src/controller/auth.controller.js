import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { generateUniqueId } from "../utils/generateUniqueId.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

/**
 * @desc Register a new user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { username, email, password, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse(res, { message: "Email already in use" }, 400);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Create new user
    const newUser = new User({
      userId: generateUniqueId("USER"),
      username,
      email,
      password: hashedPassword,
      location,
      verificationToken,
    });

    await newUser.save();

    // Send verification email
    await sendVerificationEmail(email, verificationToken);

    return successResponse(
      res,
      newUser,
      "User registered. Check your email to verify your account.",
      201
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Verify user email
 * @route GET /api/auth/verify-email/:token
 * @access Public
 */
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Find user with the token
    const user = await User.findOne({ verificationToken: token });
    if (!user) {
      return errorResponse(res, { message: "Invalid or expired token" }, 400);
    }

    // Activate user
    user.isVerified = true;
    user.verificationToken = null;
    await user.save();

    return successResponse(
      res,
      null,
      "Email verified successfully. You can now log in."
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Resend verification email
 * @route POST /api/auth/resend-verification
 * @access Public
 */
export const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, { message: "User not found" }, 404);

    // If already verified
    if (user.isVerified)
      return errorResponse(res, { message: "Email already verified" }, 400);

    // Generate new token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.verificationToken = verificationToken;
    await user.save();

    // Send email
    await sendVerificationEmail(user.email, verificationToken);

    return successResponse(res, null, "Verification email sent again.");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Login user & get token
 * @route POST /api/auth/login
 * @access Public
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check user existence
    const user = await User.findOne({ email });
    if (!user)
      return errorResponse(res, { message: "Invalid email or password" }, 401);

    // Check if verified
    if (!user.isVerified)
      return errorResponse(
        res,
        { message: "Email not verified. Please check your email." },
        403
      );

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return errorResponse(res, { message: "Invalid email or password" }, 401);

    // Generate token
    const token = jwt.sign({ id: user._id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return successResponse(res, { token, user }, "Login successful");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Request account deletion
 * @route POST /api/auth/delete
 * @access Private
 */
export const requestAccountDeletion = async (req, res) => {
  try {
    const { reason } = req.body;

    // Set deletion request
    await User.findByIdAndUpdate(req.user.id, {
      deletionRequest: { reason, requestedAt: new Date() },
    });

    return successResponse(
      res,
      null,
      "Account deletion requested. You can cancel within 7 days."
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Cancel account deletion
 * @route POST /api/auth/cancel-delete
 * @access Private
 */
export const cancelAccountDeletion = async (req, res) => {
  try {
    // Remove deletion request
    await User.findByIdAndUpdate(req.user.id, { deletionRequest: null });

    return successResponse(res, null, "Account deletion request canceled.");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
