import bcrypt from "bcryptjs";

import User from "../../models/User.js";

import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { generateUniqueId } from "../../utils/generateUniqueId.js";
import { sendOTPEmail } from "../../utils/sendEmail.js";
import { generateOTP } from "../../utils/generateOTP.js";

/**
 * @desc Register user
 * @route POST /api/auth/register
 * @access Public
 */
export const registerUser = async (req, res) => {
  try {
    const { name, phone, username, email, password, location } = req.body;

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
      name,
      phone,
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

    const userResponse = {
      userId: newUser.userId,
      name: newUser.name,
      email: newUser.email,
      username: newUser.username,
      phone: newUser.phone,
      location: newUser.location,
    };

    return successResponse(
      res,
      userResponse,
      "User registered successfully. Check your email for the OTP.",
      201
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
