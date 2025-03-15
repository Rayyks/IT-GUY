import { Queue, Worker } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";
import { sendEmail } from "./emailService.js"; // Import your email sending function

dotenv.config();

// 🔹 Setup Redis Connection
const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || "",
  maxRetriesPerRequest: null,
});

// 🔹 Create a BullMQ Queue for Emails
export const emailQueue = new Queue("emailQueue", { connection });

// 🔹 Create a Worker to Process Email Jobs
new Worker(
  "emailQueue",
  async (job) => {
    try {
      const { to, subject, html } = job.data;
      console.log(`📩 Sending email to ${to}...`);
      await sendEmail(to, subject, html);
      console.log(`✅ Email successfully sent to ${to}`);
    } catch (error) {
      console.error(`❌ Failed to send email to ${job.data.to}:`, error);
    }
  },
  { connection }
);

/**
 * Add an email job to the queue
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email body (HTML)
 */
export const queueEmail = async (to, subject, html) => {
  await emailQueue.add("sendEmail", { to, subject, html }, { attempts: 3 });
};
