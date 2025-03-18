import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import { formatIndonesianDate } from "../../utils/formatIndonesianDate.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Get a single booking by ID (Admin/Tech)
 * @route GET /api/admin/bookings/:id
 * @access Private (Admin/Tech)
 */
export const getUserBookById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the ID is a valid ObjectId or Booking ID
    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { bookingId: id };

    // Find the booking and populate user details
    const booking = await Booking.findOne(query).populate(
      "userId",
      "username email"
    );

    if (!booking) {
      return errorResponse(res, { message: "Booking not found" }, 404);
    }

    const formattedBooking = {
      ...booking.toObject(),
      scheduleDate: formatIndonesianDate(booking.scheduleDate),
      image: booking.image,
      video: booking.video,
      repairStartDate: booking.repairStartDate
        ? formatIndonesianDate(booking.repairStartDate)
        : null,
      repairEndDate: booking.repairEndDate
        ? formatIndonesianDate(booking.repairEndDate)
        : null,
    };

    return successResponse(
      res,
      formattedBooking,
      "Booking retrieved successfully"
    );
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    return errorResponse(res, error, 500);
  }
};
