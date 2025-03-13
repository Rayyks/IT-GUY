import { midtrans } from "../config/midtrans.js";
import Payment from "../models/payment.js";
import Booking from "../models/booking.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const generatePaymentRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { paymentMethod } = req.body;

    const booking = await Booking.findOne({ bookingId, userId: req.user._id });
    if (!booking)
      return errorResponse(res, { message: "Booking not found" }, 404);

    if (!booking.totalAmount || booking.totalAmount <= 0)
      return errorResponse(res, { message: "Invalid booking amount" }, 400);

    const paymentData = {
      transaction_details: {
        order_id: bookingId,
        gross_amount: booking.totalAmount,
      },
      customer_details: {
        email: req.user.email || "user@example.com",
      },
    };

    console.log("📝 Request ke Midtrans:", paymentData);

    const transaction = await midtrans.createTransaction(paymentData);

    if (!transaction || !transaction.token) {
      console.error("❌ Midtrans Response Error:", transaction);
      return errorResponse(
        res,
        { message: "Invalid response from Midtrans" },
        500
      );
    }

    // ✅ Gunakan `findOneAndUpdate` supaya nggak bikin data baru
    const payment = await Payment.findOneAndUpdate(
      { booking: booking._id },
      {
        user: req.user._id,
        amount: booking.totalAmount,
        paymentMethod,
        transactionId: bookingId,
        status: "pending",
      },
      { upsert: true, new: true }
    );

    return successResponse(
      res,
      { payment, token: transaction.token },
      `Payment request created for ${paymentMethod}`
    );
  } catch (error) {
    console.error("❌ Midtrans Payment Error:", error.message);
    return errorResponse(res, error, 500);
  }
};
