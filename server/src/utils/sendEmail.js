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
  // Format OTP with spaces for better readability
  const formattedOTP = otp.split("").join(" ");

  const mailOptions = {
    from: `"IT.GUY Support" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your Verification Code",
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verification Code</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        :root {
          --background: #ffffff;
          --foreground: #09090b;
          --muted: #f4f4f5;
          --muted-foreground: #71717a;
          --border: #e4e4e7;
          --primary: #18181b;
          --primary-foreground: #ffffff;
        }
        
        body {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          line-height: 1.6;
          color: var(--foreground);
          background-color: #f9fafb;
          margin: 0;
          padding: 0;
        }
        
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .email-wrapper {
          background-color: var(--background);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        
        .email-header {
          background-color: var(--primary);
          padding: 24px;
          text-align: center;
        }
        
        .logo {
          font-size: 24px;
          font-weight: 700;
          color: var(--primary-foreground);
          margin: 0;
        }
        
        .email-body {
          padding: 32px 24px;
        }
        
        .email-heading {
          font-size: 20px;
          font-weight: 600;
          margin-top: 0;
          margin-bottom: 16px;
          color: var(--foreground);
        }
        
        .email-text {
          font-size: 16px;
          color: var(--muted-foreground);
          margin-bottom: 24px;
        }
        
        .otp-container {
          background-color: var(--muted);
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          margin-bottom: 24px;
        }
        
        .otp-code {
          font-size: 32px;
          font-weight: 700;
          letter-spacing: 4px;
          color: var(--foreground);
        }
        
        .expiry-text {
          font-size: 14px;
          color: var(--muted-foreground);
          margin-top: 16px;
        }
        
        .email-footer {
          padding: 24px;
          text-align: center;
          border-top: 1px solid var(--border);
        }
        
        .footer-text {
          font-size: 14px;
          color: var(--muted-foreground);
          margin: 0;
        }
        
        .highlight {
          color: var(--foreground);
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="email-wrapper">
          <div class="email-header">
            <h1 class="logo">IT.GUY</h1>
          </div>
          <div class="email-body">
            <h2 class="email-heading">Verify your email address</h2>
            <p class="email-text">
              Thanks for signing up with IT.GUY. To complete your registration, please use the verification code below.
            </p>
            
            <div class="otp-container">
              <div class="otp-code">${otp}</div>
              <p class="expiry-text">This code will expire in 10 minutes</p>
            </div>
            
            <p class="email-text">
              If you didn't request this code, you can safely ignore this email. Someone else might have typed your email address by mistake.
            </p>
          </div>
          <div class="email-footer">
            <p class="footer-text">
              &copy; ${new Date().getFullYear()} IT.GUY. All rights reserved.
            </p>
            <p class="footer-text">
              This is an automated message, please do not reply to this email.
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  try {
    let info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to ${email}: ${info.response}`);
    return true;
  } catch (error) {
    console.error("❌ Email sending error:", error);
    throw error;
  }
};
