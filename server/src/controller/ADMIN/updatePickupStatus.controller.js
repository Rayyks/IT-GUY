import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { queueEmail } from "../../utils/emailQueue.js";
import Notification from "../../models/notification.js";

/**
 * @desc Update Pickup Status
 * @route PUT /api/bookings/:id/pickup-status
 * @access Admin/Tech
 */
export const updatePickupStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { pickupStatus } = req.body;

    const isObjectId = mongoose.Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { bookingId: id };

    const booking = await Booking.findOne(query).populate("userId", "email");
    if (!booking)
      return errorResponse(res, { message: "Booking not found" }, 404);

    if (booking.method !== "pickup") {
      return errorResponse(
        res,
        { message: "This booking is not for pickup" },
        400
      );
    }

    booking.pickupStatus = pickupStatus;
    await booking.save();

    console.log(`🚗 Pickup status updated: ${pickupStatus}`);
    if (pickupStatus === "completed") {
      await Notification.create({
        userId: booking.userId._id,
        bookingId: booking.bookingId,
        title: "Pickup Completed 🎉",
        message: `Your item (ID: ${booking.bookingId}) has been successfully picked up.`,
      });
      console.log(`✅ Notification stored for pickup ${booking.bookingId}`);
    }

    const subject = "Pickup Status Updated";
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pickup Status Update</title>
    </head>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #eee;">
        <div style="background-color: #2B3990; color: white; padding: 20px; text-align: center;">
          <div style="font-weight: bold; font-size: 24px; letter-spacing: 1px;">IT.GUY</div>
        </div>
        <div style="padding: 25px;">
          <p>Hello,</p>
          <p>We're writing to inform you that your repair pickup with Booking ID <span style="background-color: #e9f0ff; display: inline-block; padding: 5px 10px; border-radius: 4px; font-weight: bold; color: #2B3990;">${
            booking.bookingId
          }</span> has been updated.</p>
          
          <div style="background-color: #f8f9fa; border-left: 5px solid #2B3990; padding: 15px; margin: 20px 0; font-size: 18px; font-weight: 600; color: #2B3990; text-align: center;">
            ${pickupStatus.toUpperCase()}
          </div>
          
          <p>Our team is working diligently on your request and will keep you informed of any further updates.</p>
          <p>Thank you for choosing IT.GUY for your technical needs!</p>
          <p>Best Regards,<br>IT.GUY Team</p>
        </div>
        <div style="background-color: #f8f9fa; padding: 15px 25px; font-size: 14px; color: #666; border-top: 1px solid #eeeeee; text-align: center;">
          © ${new Date().getFullYear()} IT.GUY - All Rights Reserved
        </div>
      </div>
    </body>
    </html>
    `;

    await queueEmail(booking.userId.email, subject, html);

    return successResponse(
      res,
      booking,
      `Pickup status updated to '${pickupStatus}' successfully`
    );
  } catch (error) {
    console.error("❌ Error updating pickup status:", error);
    return errorResponse(res, error, 500);
  }
};
