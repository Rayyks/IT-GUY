import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

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
