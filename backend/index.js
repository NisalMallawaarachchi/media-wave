import express from "express";
import dotenv from "dotenv";
import connectDB from "./db.js";
import userRouter from "./routes/user.route.js";

// Load environment variables early
dotenv.config();

// Connect to the database
connectDB();

// Initialize the Express application
const app = express();

app.use(express.json());

// Routes
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
