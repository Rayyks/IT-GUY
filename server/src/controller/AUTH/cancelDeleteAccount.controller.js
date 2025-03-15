import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

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
