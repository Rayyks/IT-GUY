import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Get all users (Admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email isActive");
    return successResponse(res, users, "All users retrieved successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
