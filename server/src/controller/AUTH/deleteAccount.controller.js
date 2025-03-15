import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * @desc Request account deletion
 * @route POST /api/auth/delete
 * @access Private
 */
export const requestAccountDeletion = async (req, res) => {
  try {
    const { reason } = req.body;

    // Set deletion request
    await User.findByIdAndUpdate(req.user.id, {
      deletionRequest: { reason, requestedAt: formatDate(new Date()) },
    });

    return successResponse(
      res,
      null,
      "Account deletion requested. You can cancel within 7 days."
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
