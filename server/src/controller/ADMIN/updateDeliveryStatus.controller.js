import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { queueEmail } from "../../utils/emailQueue.js";
import Notification from "../../models/notification.js";

export const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { deliveryStatus } = req.body;

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

    if (booking.deliveryMethod !== "itguy-delivery") {
      return errorResponse(
        res,
        {
          message: "Delivery status can only be updated for ITGUY delivery",
        },
        400
      );
    }

    booking.deliveryStatus = deliveryStatus;
    await booking.save();

    console.log(`🚚 Delivery status updated: ${deliveryStatus}`);

    if (deliveryStatus === "delivered") {
      await Notification.create({
        userId: booking.userId._id,
        bookingId: booking.bookingId,
        title: "Delivery Completed 🎉",
        message: `Your repair item (ID: ${booking.bookingId}) has been delivered successfully.`,
      });
      console.log(
        `✅ Notification stored for delivered item ${booking.bookingId}`
      );
    }

    const subject = "Delivery Status Updated";
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Delivery Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #2B3990; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">IT.GUY</h1>
    </div>
    
    <div style="padding: 30px 25px;">
      <p>Hello,</p>
      <p>We're writing to inform you that your repair item with Booking ID <span style="background-color: #e9f0ff; display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; color: #2B3990;">${
        booking.bookingId
      }</span> has been updated.</p>
      
      <div style="background-color: #f8f9fa; border-left: 5px solid #2B3990; padding: 20px; margin: 25px 0; border-radius: 4px; text-align: center;">
        <p style="font-size: 16px; margin: 0 0 10px 0;">Delivery Status:</p>
        <p style="font-size: 22px; font-weight: bold; color: #2B3990; margin: 0;">${deliveryStatus.toUpperCase()}</p>
      </div>
      
      <p>Our team is working diligently on your request and will keep you informed of any further updates.</p>
      <p>Thank you for choosing IT.GUY for your technical needs!</p>
      
      <div style="margin-top: 30px;">
        <p style="margin-bottom: 5px;">Best Regards,</p>
        <p style="font-weight: bold; margin-top: 0;">IT.GUY Team</p>
      </div>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="color: #777; font-size: 14px; margin: 5px 0;">© ${new Date().getFullYear()} IT.GUY - All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
`;

    await queueEmail(userEmail, subject, html);

    return successResponse(
      res,
      booking,
      `Delivery status updated to '${deliveryStatus}' successfully`
    );
  } catch (error) {
    console.error("❌ Error updating delivery status:", error);
    return errorResponse(res, error, 500);
  }
};
