import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import morgan from "morgan";
import { errorHandler } from "./middlewares/errorHandler.js";

// ROUTES IMPRORT
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import bookingRoutes from "./routes/booking.routes.js";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Serve uploads folder as static
app.use("/uploads", express.static(path.join(process.cwd(), "src/uploads")));

// API ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/booking", bookingRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({ message: "IT.GUY API is running 🚀" });
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
