import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema({
  url: String,
  public_id: String,
  format: String,
  width: Number,
  height: Number,
  bytes: Number,
  title: String,
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Media", mediaSchema);
