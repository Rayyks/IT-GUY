import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Activate/Deactivate user (Admin only)
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) return errorResponse(res, { message: "User not found" }, 404);

    user.isActive = !user.isActive;
    await user.save();

    return successResponse(
      res,
      user,
      `User ${user.isActive ? "activated" : "deactivated"} successfully`
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
