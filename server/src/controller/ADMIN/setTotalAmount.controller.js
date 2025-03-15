import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import Notification from "../../models/notification.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { queueEmail } from "../../utils/emailQueue.js";
import { formatRupiah } from "../../utils/formatRupiah.js";

export const setTotalAmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { totalAmount } = req.body;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { bookingId: id };

    const booking = await Booking.findOne(query).populate("userId", "email");
    if (!booking)
      return errorResponse(res, { message: "Booking not found" }, 404);

    const userEmail = booking.userId?.email;
    if (!userEmail) {
      console.error(`❌ No email found for booking ${booking.bookingId}`);
      return errorResponse(res, { message: "User email not found" }, 400);
    }

    booking.totalAmount = totalAmount;
    await booking.save();

    const existingNotification = await Notification.findOne({
      bookingId: booking.bookingId,
      title: "Total Amount Updated",
    });

    if (existingNotification) {
      existingNotification.message = `Your booking (ID: ${
        booking.bookingId
      }) total amount is now  ${formatRupiah(totalAmount)}.`;
      await existingNotification.save();
      console.log("🔄 Notification updated.");
    } else {
      await Notification.create({
        userId: booking.userId._id,
        bookingId: booking.bookingId,
        title: "Total Amount Updated",
        message: `Your booking (ID: ${
          booking.bookingId
        }) total amount is now  ${formatRupiah(totalAmount)}.`,
      });
      console.log("✅ New notification created.");
    }

    // 🔹 Email
    const subject = "Total Amount Updated";
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Total Amount Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #2B3990; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Total Amount Updated</h1>
    </div>
    
    <div style="padding: 30px 25px;">
      <p>Dear Customer,</p>
      <p>We wanted to inform you that the total amount for your booking has been updated.</p>
      
      <div style="background-color: #f8f9fa; border-left: 5px solid #2B3990; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 8px 0;"><strong>📌 Booking ID:</strong> <span style="background-color: #e9f0ff; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #2B3990;">${
          booking.bookingId
        }</span></p>
        <p style="margin: 8px 0;"><strong>💰 New Total Amount:</strong> <span style="font-weight: bold; color: #2B3990; font-size: 18px;"> ${formatRupiah(
          totalAmount
        )}</span></p>
      </div>
      
      <p>If you have any questions about this update, please feel free to contact our support team.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:rayydna14@gmail.com" style="background-color: #2B3990; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">Contact Support</a>
      </div>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="color: #777; font-size: 14px; margin: 5px 0;">This is an automated email from IT.GUY. Please do not reply to this message.</p>
      <p style="color: #777; font-size: 14px; margin: 5px 0;">© ${new Date().getFullYear()} IT.GUY - All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
`;

    await queueEmail(userEmail, subject, html);

    return successResponse(res, booking, "Total amount updated successfully");
  } catch (error) {
    console.error("❌ Error updating total amount:", error);
    return errorResponse(res, error, 500);
  }
};
