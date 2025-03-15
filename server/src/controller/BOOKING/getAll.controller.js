import Booking from "../../models/booking.js";
import { formatDate } from "../../utils/formatDate.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * @desc Get all bookings for the logged-in user
 * @route GET /api/booking
 * @access Private (User)
 */
export const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    const formattedBookings = bookings.map((booking) => ({
      ...booking.toObject(),
      scheduleDate: formatDate(booking.scheduleDate),
    }));

    return successResponse(
      res,
      formattedBookings,
      "User bookings retrieved successfully"
    );
  } catch (error) {
    console.error("❌ Error Fetching User Bookings:", error);
    return errorResponse(res, error, 500);
  }
};
