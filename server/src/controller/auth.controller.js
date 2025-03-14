import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { env } from "../config/env.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { generateUniqueId } from "../utils/generateUniqueId.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, location } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return errorResponse(res, { message: "Email already in use" }, 400);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Create new user
    const newUser = new User({
      userId: generateUniqueId("USER"),
      username,
      email,
      password: hashedPassword,
      location,
      otpCode,
      otpExpiresAt,
    });

    await newUser.save();

    // Send OTP email
    await sendOTPEmail(email, otpCode);

    return successResponse(
      res,
      null,
      "User registered. Check your email for the OTP.",
      201
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Verify user OTP
 * @route GET /api/auth/verify-email/:token
 * @access Public
 */
export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, { message: "User not found" }, 404);

    // Check OTP & expiry
    if (user.otpCode !== otp || new Date() > user.otpExpiresAt) {
      return errorResponse(res, { message: "Invalid or expired OTP" }, 400);
    }

    // Mark user as verified
    user.isVerified = true;
    user.otpCode = null;
    user.otpExpiresAt = null;
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
 * @desc Resend OTP
 * @route POST /api/auth/resend-verification
 * @access Public
 */
export const resendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, { message: "User not found" }, 404);

    // If already verified, no need to resend
    if (user.isVerified)
      return errorResponse(res, { message: "Email already verified" }, 400);

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send email
    await sendOTPEmail(user.email, otpCode);

    return successResponse(res, null, "A new OTP has been sent to your email.");
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
