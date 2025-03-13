import express from "express";
import Booking from "../models/booking.js";
import Payment from "../models/payment.js";

const router = express.Router();

const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN;
// 🚀 Webhook endpoint untuk update status pembayaran
router.post("/xendit/webhook", async (req, res) => {
  try {
    const { id, external_id, status } = req.body;

    console.log("📩 Xendit Webhook Received:", req.body);

    // ✅ Pastikan booking ada di database
    const booking = await Booking.findOne({ bookingId: external_id });
    if (!booking) {
      console.error("❌ Booking tidak ditemukan!");
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // ✅ Pastikan payment ada di database
    const payment = await Payment.findOne({ transactionId: id });
    if (!payment) {
      console.error("❌ Payment tidak ditemukan!");
      return res
        .status(404)
        .json({ success: false, message: "Payment not found" });
    }

    // 🛠️ Konversi status Xendit ke format database kita
    let paymentStatus = "pending";
    if (status === "PAID") paymentStatus = "paid";
    if (status === "FAILED" || status === "EXPIRED") paymentStatus = "failed";

    // 🔄 Update status di database
    await Booking.updateOne({ bookingId: external_id }, { paymentStatus });
    await Payment.updateOne({ transactionId: id }, { status: paymentStatus });

    console.log(
      `✅ Booking ${external_id} payment status updated to ${paymentStatus}`
    );

    return res
      .status(200)
      .json({ success: true, message: "Payment status updated" });
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
