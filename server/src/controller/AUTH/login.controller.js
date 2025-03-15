import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import { env } from "../../config/env.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

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
