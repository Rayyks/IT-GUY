import Booking from "../../models/booking.js";
import Payment from "../../models/payment.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Get a single booking by ID
 * @route GET /api/booking/:id
 * @access Private (User/Admin/Tech)
 */
export const getBookingById = async (req, res) => {
  try {
    const query = { bookingId: req.params.id };

    // Allow only users to see their own bookings, but admins/tech can access all
    if (req.user.role !== "admin" && req.user.role !== "tech") {
      query.userId = req.user._id;
    }

    const booking = await Booking.findOne(query).populate(
      "userId",
      "username email"
    );

    if (!booking) {
      console.warn("Booking Not Found:", req.params.id);
      return errorResponse(res, { message: "Booking not found" }, 404);
    }

    // Fetch payment data related to the booking
    const payment = await Payment.findOne({ booking: booking._id });

    const bookingData = {
      ...booking.toObject(),
      payment: payment ? payment.toObject() : null,
    };

    return successResponse(
      res,
      bookingData,
      "Booking details retrieved successfully"
    );
  } catch (error) {
    console.error("Error Fetching Booking:", error);
    return errorResponse(res, error, 500);
  }
};
