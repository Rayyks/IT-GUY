import Booking from "../../models/booking.js";
import { sendEmail } from "../../utils/emailService.js";
import { formatDate } from "../../utils/formatDate.js";

/**
 * Reschedule a booking
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 */
export const rescheduleBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { newScheduleDate } = req.body;

    if (!newScheduleDate) {
      return res.status(400).json({ message: "New schedule date is required" });
    }

    const booking = await Booking.findOne({ bookingId });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // 🚨 Prevent rescheduling if booking or pickup is NOT pending
    if (booking.status !== "pending" || booking.pickupStatus !== "pending") {
      return res.status(400).json({
        message: "Cannot reschedule. Booking or pickup is already in progress.",
      });
    }

    // Update schedule date
    booking.scheduleDate = new Date(newScheduleDate);
    await booking.save();

    // Send email notification to client
    const clientEmail = booking.userId.email;
    const subject = `Booking Rescheduled - ${booking.bookingId}`;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Rescheduled</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #2B3990; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Your Booking Has Been Rescheduled</h1>
    </div>
    
    <div style="padding: 30px 25px;">
      <p>Dear Customer,</p>
      <p>Your booking with ID <span style="background-color: #e9f0ff; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #2B3990;">${
        booking.bookingId
      }</span> has been rescheduled.</p>
      
      <div style="background-color: #f8f9fa; border-left: 5px solid #2B3990; padding: 20px; margin: 20px 0; border-radius: 4px; text-align: center;">
        <p style="margin: 8px 0;"><strong>New Scheduled Date:</strong></p>
        <p style="font-size: 18px; font-weight: bold; color: #2B3990; margin: 5px 0;">${formatDate(
          booking.scheduleDate
        )}</p>
      </div>
      
      <p>If you did not request this change, please contact our support team immediately.</p>
      
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

    await sendEmail(clientEmail, subject, html);

    return res.status(200).json({
      message: "Booking successfully rescheduled",
      newScheduleDate: booking.scheduleDate,
      pickupStatus: booking.pickupStatus,
    });
  } catch (error) {
    console.error("Reschedule error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
