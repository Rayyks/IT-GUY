import mongoose from "mongoose";
import { env } from "./config/env.js";
import app from "./app.js";
import connectDB from "./config/db.js";

// Connect to MongoDB
connectDB();

// Start Server
const PORT = env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
