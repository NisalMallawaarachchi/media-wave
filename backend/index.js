import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";

// Load environment variables early
dotenv.config();

// Connect to the database
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("✅ Connected to the database");
  })
  .catch((error) => {
    console.error("❌ Failed to connect to the database:", error);
  });

const app = express();

const PORT = process.env.PORT || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
