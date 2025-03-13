import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Get all bookings (Admin/Tech)
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "username email");
    return successResponse(
      res,
      bookings,
      "All bookings retrieved successfully"
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
