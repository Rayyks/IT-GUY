import mongoose from "mongoose";
import Payment from "../../models/payment.js";
import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Confirm payment (Admin/Tech)
 * @route PUT /api/payments/:id/confirm
 */
export const confirmPayment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return errorResponse(res, { message: "Invalid payment ID" }, 400);
    }

    const payment = await Payment.findById(id).populate("booking");

    if (!payment) {
      return errorResponse(res, { message: "Payment not found" }, 404);
    }

    const booking = payment.booking;

    // Allow Admin to confirm only COD payments manually
    if (payment.paymentMethod !== "cash_on_delivery") {
      return errorResponse(
        res,
        { message: "Payment method not supported" },
        400
      );
    }

    // Mark payment as confirmed
    payment.status = "paid";
    booking.paymentStatus = "paid";

    await payment.save();
    await booking.save();

    return successResponse(res, payment, "Payment confirmed successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
