import Payment from "../../models/payment.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";

/**
 * Refund failed payment (Admin/Tech)
 */
export const refundPayment = async (req, res) => {
  try {
    const { id } = req.params;

    const payment = await Payment.findOne({
      $or: [{ _id: id }, { booking: id }],
    });

    if (!payment)
      return errorResponse(res, { message: "Payment not found" }, 404);

    if (payment.status !== "failed") {
      return errorResponse(
        res,
        { message: "Only failed payments can be refunded" },
        400
      );
    }

    payment.status = "refunded";
    await payment.save();

    return successResponse(res, payment, "Payment refunded successfully");
  } catch (error) {
    return errorResponse(res, error, 500);
  }
};
