import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { sendOTPEmail } from "../../utils/sendEmail.js";
import { generateOTP } from "../../utils/generateOTP.js";

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
