import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { formatDate } from "./formatDate.js";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/**
 * Send an email notification
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body content (HTML format)
 */
export const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"IT.GUY Support" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      html,
    };

    let info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${to}: ${info.response}`);
  } catch (error) {
    console.error(`❌ Email sending error to ${to}:`, error);
  }
};

/**
 * Send booking creation email to the admin
 * @param {Object} booking - Booking details
 */
export const sendAdminBookingNotification = async (booking) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  const subject = `New Booking Created - ${booking.bookingId}`;
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Booking Created</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f4f4f4;">
  <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
    <div style="background-color: #2B3990; padding: 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">New Booking Created</h1>
    </div>
    
    <div style="padding: 30px 25px;">
      <div style="background-color: #f8f9fa; border-left: 5px solid #2B3990; padding: 20px; margin: 20px 0; border-radius: 4px;">
        <p style="margin: 8px 0;"><strong>Booking ID:</strong> <span style="background-color: #e9f0ff; padding: 3px 8px; border-radius: 4px; font-weight: bold; color: #2B3990;">${
          booking.bookingId
        }</span></p>
        <p style="margin: 8px 0;"><strong>Client:</strong> ${booking.userId}</p>
        <p style="margin: 8px 0;"><strong>Category:</strong> ${
          booking.category
        }</p>
        <p style="margin: 8px 0;"><strong>Method:</strong> ${booking.method}</p>
        <p style="margin: 8px 0;"><strong>Scheduled Date:</strong> ${formatDate(
          booking.scheduleDate
        )}</p>
      </div>
      
      <p style="text-align: center; font-weight: bold; margin-top: 30px;">Check the admin panel for more details.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="#" style="background-color: #2B3990; color: #fff; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold; display: inline-block;">Open Admin Panel</a>
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

  await sendEmail(adminEmail, subject, html);
};
