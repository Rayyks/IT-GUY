import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * @desc Cancel a booking
 * @route PUT /api/booking/:id/cancel
 * @access Private (User)
 */
export const cancelBooking = async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const booking = await Booking.findOne({
      bookingId: req.params.id,
      userId: req.user._id,
    });

    if (!booking) {
      return errorResponse(res, { message: "Booking not found" }, 404);
    }

    if (booking.status !== "pending") {
      return errorResponse(
        res,
        { message: "Only pending bookings can be cancelled" },
        400
      );
    }

    booking.status = "cancelled";
    booking.cancelReason = cancelReason || "No reason provided";
    await booking.save();

    return successResponse(res, booking, "Booking cancelled successfully");
  } catch (error) {
    console.error("❌ Error Cancelling Booking:", error);
    return errorResponse(res, error, 500);
  }
};
