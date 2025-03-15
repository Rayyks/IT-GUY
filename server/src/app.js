import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import { body, validationResult } from "express-validator";
import { errorHandler } from "./middlewares/errorHandler.js";

// LIMITER
import { generalLimiter } from "./middlewares/rateLimiter.js";

// ROUTES IMPORT
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import bookingRoutes from "./routes/booking.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import adminRoutes from "./routes/admin.routes.js";

// Load environment variables
dotenv.config();

const app = express();

// Security Middleware
app.use(helmet()); // Secure HTTP headers
app.use(mongoSanitize()); // Prevent NoSQL injections
app.use(express.json());

// Input Sanitization Middleware
app.use([
  body("*").escape().trim(), // Sanitize all incoming request data
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "Invalid input detected" });
    }
    next();
  },
]);

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

// Logging & Rate Limiting
app.use(morgan("dev"));
app.use(generalLimiter);

// Hide Express Info
app.disable("x-powered-by");

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "IT.GUY API is running 🚀" });
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
