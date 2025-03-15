import rateLimit from "express-rate-limit";

/**
 * Limit requests on authentication routes (e.g., login, OTP)
 * Max 5 requests per minute
 */
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per `windowMs`
  message: { message: "Too many requests, please try again later." },
  headers: true,
});

/**
 * General rate limiter (for all routes)
 * Max 100 requests per hour
 */
export const generalLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per `windowMs`
  message: { message: "Rate limit exceeded. Try again later." },
  headers: true,
});
