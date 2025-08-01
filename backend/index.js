import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./db.js";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import uploadRouter from "./routes/upload.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

// Load environment variables early
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/dashboard", dashboardRouter);

// Global error handler (middleware)
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500; // If the error has a status code, use it; otherwise, default to 500
  const message = err.message || "Internal Server Error"; // If the error has a specific message, use it; otherwise, default to a generic message
  return res.status(statusCode).json({
    success: false,
    statusCode,
    error: message,
  });
});

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
