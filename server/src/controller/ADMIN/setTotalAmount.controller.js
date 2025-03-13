import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import Payment from "../../models/payment.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Set total amount for a booking (Admin/Tech)
 */
export const setTotalAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount } = req.body;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { bookingId: id };

    const booking = await Booking.findOne(query);

    if (!booking)
      return errorResponse(res, { message: "Booking not found" }, 404);

    booking.totalAmount = totalAmount;
    await booking.save();

    // Update the corresponding payment amount
    const payment = await Payment.findOne({ booking: booking._id });

    if (payment) {
      payment.amount = totalAmount;
      await payment.save();
    }

    return successResponse(res, booking, "Total amount updated successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
