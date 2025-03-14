import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOTPEmail = async (email, otp) => {
  const mailOptions = {
    from: `"IT.GUY Support" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your OTP Code",
    html: `<h2>Your OTP Code</h2><p>Use this code to verify your email: <strong>${otp}</strong></p><p>This OTP expires in 10 minutes.</p>`,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}: ${info.response}`);
  } catch (error) {
    console.error("❌ Email sending error:", error);
  }
};
