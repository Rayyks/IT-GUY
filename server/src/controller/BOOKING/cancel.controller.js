import Booking from "../../models/booking.js";
import User from "../../models/User.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { sendEmail } from "../../utils/emailService.js";
import { formatDate } from "../../utils/formatDate.js";
import Notification from "../../models/notification.js";

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

    const user = await User.findById(req.user._id);
    const userEmail = user?.email || "No email found";

    booking.status = "cancelled";
    booking.cancelReason = cancelReason || "No reason provided";
    await booking.save();

    // ✅ Save Notification
    await Notification.create({
      userId: booking.userId._id,
      bookingId: booking.bookingId,
      title: "Booking Cancelled",
      message: `Your booking #${booking.bookingId} has been cancelled.`,
    });

    const subject = `Booking #${booking.bookingId} Cancelled`;
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Cancellation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #2B3990; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Booking Cancellation Notice</h1>
    </div>
    
    <div style="padding: 30px 25px;">
      <p>Dear Customer,</p>
      <p>We regret to inform you that your booking has been cancelled.</p>
      
      <div style="background-color: #f8f9fa; border-left: 5px solid #2B3990; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 8px 0;"><strong>Booking ID:</strong> <span style="background-color: #e9f0ff; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #2B3990;">${
          booking.bookingId
        }</span></p>
        <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: #dc3545; font-weight: bold;">CANCELLED</span></p>
        <p style="margin: 8px 0;"><strong>Cancellation Reason:</strong> ${
          booking.cancelReason
        }</p>
      </div>
      
      <p>If you have any questions or would like to make a new booking, please contact our support team.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:rayydna14@gmail.com" style="background-color: #2B3990; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">Contact Support</a>
      </div>
    </div>
    
    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-top: 1px solid #eeeeee;">
      <p style="color: #777; font-size: 14px; margin: 5px 0;">This is an automated notification from IT.GUY.</p>
      <p style="color: #777; font-size: 14px; margin: 5px 0;">© ${new Date().getFullYear()} IT.GUY - All Rights Reserved</p>
    </div>
  </div>
</body>
</html>
`;

    await Promise.all([
      sendEmail(userEmail, subject, htmlContent),
      sendEmail("rayydna14@gmail.com", subject, htmlContent),
    ]);

    return successResponse(
      res,
      { ...booking.toObject(), scheduleDate: formatDate(booking.scheduleDate) },
      "Booking cancelled & notification saved"
    );
  } catch (error) {
    console.error("❌ Error Cancelling Booking:", error);
    return errorResponse(res, error, 500);
  }
};
