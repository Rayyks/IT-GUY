import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * @desc Update User Profile
 * @route PUT /api/user/update
 * @access Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const { username, email, location } = req.body;

    // Prevent email change without verification (for future implementation)
    if (email && email !== req.user.email) {
      return errorResponse(
        res,
        { message: "Email update requires verification" },
        400
      );
    }

    // Update user details
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { username, email, location },
      { new: true }
    );

    return successResponse(res, updatedUser, "Profile updated successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
