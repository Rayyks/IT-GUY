import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * @desc Get User Fix History (Only Completed Repairs)
 * @route GET /api/user/fix-history
 * @access Private
 */
export const getUserFixHistory = async (req, res) => {
  try {
    const fixHistory = await Booking.find({
      userId: req.user.id,
      status: "completed",
    });

    return successResponse(
      res,
      fixHistory,
      "Completed fix history retrieved successfully"
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
