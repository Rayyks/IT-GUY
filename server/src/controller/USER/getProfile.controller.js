import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * @desc Get User Profile
 * @route GET /api/user/profile
 * @access Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return errorResponse(res, { message: "User not found" }, 404);
    }
    return successResponse(res, user, "User profile fetched successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
