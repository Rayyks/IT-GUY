import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { sendOTPEmail } from "../../utils/sendEmail.js";
import { generateOTP } from "../../utils/generateOTP.js";

/**
 * @desc Request password reset (send OTP)
 * @route POST /api/auth/request-password-reset
 * @access Public
 */
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, { message: "User not found" }, 404);

    // Generate new OTP
    const otpCode = generateOTP();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.otpCode = otpCode;
    user.otpExpiresAt = otpExpiresAt;
    await user.save();

    // Send OTP email
    await sendOTPEmail(user.email, otpCode);

    return successResponse(res, null, "Password reset OTP sent to your email.");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};

/**
 * @desc Verify OTP & Reset Password
 * @route POST /api/auth/reset-password
 * @access Public
 */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return errorResponse(res, { message: "User not found" }, 404);

    // Check OTP & expiry
    if (user.otpCode !== otp || new Date() > user.otpExpiresAt) {
      return errorResponse(res, { message: "Invalid or expired OTP" }, 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password & clear OTP
    user.password = hashedPassword;
    user.otpCode = null;
    user.otpExpiresAt = null;
    await user.save();

    return successResponse(res, null, "Password reset successfully.");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
