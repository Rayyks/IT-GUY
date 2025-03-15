import Booking from "../../models/booking.js";
import { formatIndonesianDate } from "../../utils/formatIndonesianDate.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Get all bookings (Admin/Tech)
 */
export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("userId", "username email");

    const formattedBookings = bookings.map((booking) => ({
      ...booking.toObject(),
      scheduleDate: formatIndonesianDate(booking.scheduleDate),
    }));

    return successResponse(
      res,
      formattedBookings,
      "All bookings retrieved successfully"
    );
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
