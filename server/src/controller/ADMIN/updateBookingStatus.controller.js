import mongoose from "mongoose";
import Booking from "../../models/booking.js";
import { successResponse, errorResponse } from "../../utils/responseHandler.js";
import { queueEmail } from "../../utils/emailQueue.js";
import Notification from "../../models/notification.js";
import { formatIndonesianDate } from "../../utils/formatIndonesianDate.js";

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, techMessage, repairMedia } = req.body;

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

    // Update booking status
    booking.status = status;

    // Update repairStartDate when status is 'in-progress'
    if (status === "in-progress" && !booking.repairStartDate) {
      booking.repairStartDate = new Date();
    }

    // Update repairEndDate when status is 'completed'
    if (status === "completed" && !booking.repairEndDate) {
      booking.repairEndDate = new Date();
    }

    // Optional: Add techMessage to the booking if provided
    if (techMessage) booking.techMessage = techMessage;

    // Handle newly uploaded files
    if (req.files && req.files.length > 0) {
      const newMedia = req.files.map((file) => ({
        url: `/uploads/${file.filename}`,
        type: file.mimetype.startsWith("image") ? "image" : "video",
        uploadedAt: new Date(),
      }));
      booking.repairMedia.push(...newMedia);
    }

    // Save the updated booking
    await booking.save();

    console.log(
      `🔔 Booking ${id} status updated to '${status}' | Tech Message: ${
        techMessage || "No message"
      }`
    );

    // Send notification when the booking is completed
    if (status === "completed") {
      await Notification.create({
        userId: booking.userId._id,
        bookingId: booking.bookingId,
        title: "Booking Completed 🎉",
        message: `Your repair booking (ID: ${
          booking.bookingId
        }) is now '${status}'. ${techMessage ? `Tech: "${techMessage}"` : ""}`,
      });
      console.log(
        `✅ Notification stored for completed booking ${booking.bookingId}`
      );
    }

    // Get the absolute base URL for media files
    const baseUrl = process.env.BASE_URL || "https://itguy.com"; // Update with your actual domain

    // Generate media HTML content for email
    const generateMediaHTML = () => {
      // If there's no repair media, return empty string
      if (!booking.repairMedia || booking.repairMedia.length === 0) {
        return "";
      }

      // Generate HTML for the media section - simple vertical list
      let mediaHTML = `
        <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px;">
          <h3 style="color: #2B3990; margin-bottom: 15px;">Repair Documentation:</h3>
      `;

      // Process each media item as a vertical list item
      booking.repairMedia.forEach((media, index) => {
        const isImage = media.type === "image";
        const fullUrl = `${baseUrl}${media.url}`;
        const date = new Date(media.uploadedAt).toLocaleDateString();

        mediaHTML += `
          <div style="margin-bottom: 20px; border: 1px solid #eee; border-radius: 8px; overflow: hidden; background-color: #f8f9fa;">
            <div style="padding: 10px; background-color: #f0f0f0; border-bottom: 1px solid #eee;">
              <strong>Item ${index + 1}</strong> - ${date}
            </div>
        `;

        if (isImage) {
          mediaHTML += `
            <div style="padding: 15px; text-align: center;">
              <a href="${fullUrl}" target="_blank" style="display: block;">
                <img src="${fullUrl}" alt="Repair Image ${
            index + 1
          }" style="max-width: 100%; height: auto; border-radius: 4px; margin: 0 auto;">
              </a>
            </div>
          `;
        } else {
          mediaHTML += `
            <div style="padding: 25px 15px; text-align: center;">
              <span style="font-size: 30px; display: block; margin-bottom: 10px;">🎬</span>
              <a href="${fullUrl}" style="color: #2B3990; text-decoration: underline; font-weight: bold; display: block;" target="_blank">
                View Video ${index + 1}
              </a>
            </div>
          `;
        }

        mediaHTML += `
          </div>
        `;
      });

      mediaHTML += `
        <p style="font-size: 13px; color: #777; margin-top: 15px;">
          * Click on images or videos to view in browser. Some email clients may block media content for security reasons.
        </p>
      </div>
      `;

      return mediaHTML;
    };

    // Prepare email content
    const subject = `🚀 Your Booking Status is Now '${status}'`;
    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Booking Status Update</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #2B3990; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Booking Status Updated</h1>
    </div>
    
    <div style="padding: 30px 25px;">
      <p>Dear Customer,</p>
      <p>We wanted to inform you that the status of your booking has been updated.</p>
      
      <div style="background-color: #f8f9fa; border-left: 5px solid #2B3990; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 8px 0;"><strong>📌 Booking ID:</strong> <span style="background-color: #e9f0ff; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #2B3990;">${
          booking.bookingId
        }</span></p>
        <p style="margin: 8px 0;"><strong>📍 New Status:</strong> <span style="font-weight: bold; color: #2B3990; font-size: 18px;">${status}</span></p>
        ${
          techMessage
            ? `<p style="margin: 8px 0;"><strong>🛠️ Tech Message:</strong> <span style="font-style: italic;">${techMessage}</span></p>`
            : ""
        }
        ${
          status === "in-progress"
            ? `<p><strong>🛠️ Repair Started:</strong> ${formatIndonesianDate(
                booking.repairStartDate,
                true
              )}</span></p>`
            : ""
        }
        ${
          status === "completed"
            ? `<p><strong>✅ Repair Completed:</strong> ${formatIndonesianDate(
                booking.repairEndDate,
                true
              )}</span></p>`
            : ""
        }
      </div>
      
      ${generateMediaHTML()}
      
      <p>If you have any questions about this update, please feel free to contact our support team.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="mailto:support@itguy.com" style="background-color: #2B3990; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">Contact Support</a>
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

    // Send email notification
    await queueEmail(userEmail, subject, html);

    return successResponse(res, booking, "Booking status updated successfully");
  } catch (error) {
    console.error("❌ Error updating booking:", error);
    return errorResponse(res, error, 500);
  }
};
