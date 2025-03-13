import express from "express";
import Payment from "../models/payment.js";
import Booking from "../models/booking.js";
import { protect } from "../middlewares/authMiddleware.js";
import { generatePaymentRequest } from "../controller/payment.controller.js";

const router = express.Router();

// Generate Xendit payment token
router.post("/:bookingId", protect, generatePaymentRequest);

// 🚀 Webhook endpoint to update payment status
router.post("/midtrans/webhook", async (req, res) => {
  try {
    const { order_id, transaction_status } = req.body;
    console.log("📩 Midtrans Webhook:", req.body);

    const payment = await Payment.findOne({ transactionId: order_id });
    if (!payment)
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });

    let paymentStatus = "pending";
    if (
      transaction_status === "settlement" ||
      transaction_status === "capture"
    ) {
      paymentStatus = "paid";
    } else if (
      transaction_status === "deny" ||
      transaction_status === "cancel" ||
      transaction_status === "expire"
    ) {
      paymentStatus = "failed";
    }

    await Payment.updateOne(
      { transactionId: order_id },
      { status: paymentStatus }
    );
    await Booking.updateOne({ bookingId: order_id }, { paymentStatus });

    console.log(`✅ Payment ${order_id} updated to ${paymentStatus}`);
    return res
      .status(200)
      .json({ success: true, message: "Payment status updated" });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
