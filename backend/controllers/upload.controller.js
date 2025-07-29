// controllers/uploadController.js
import { cloudinary } from "../config/cloudinaryConfig.js";
import fs from "fs/promises";
import Media from "../models/media.model.js";

export const uploadFiles = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No files were uploaded",
      });
    }

    const uploadPromises = req.files.map(async (file) => {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "media-gallery",
        resource_type: "auto",
        allowed_formats: ["jpg", "jpeg", "png"],
        transformation: [
          { width: 1920, height: 1080, crop: "limit" },
          { quality: "auto" },
        ],
      });

      // Delete temp file after upload
      await fs.unlink(file.path);
      return result;
    });

    const results = await Promise.allSettled(uploadPromises);

    const uploadedFiles = results
      .filter((result) => result.status === "fulfilled")
      .map((result) => ({
        url: result.value.secure_url,
        public_id: result.value.public_id,
        format: result.value.format,
        width: result.value.width,
        height: result.value.height,
        bytes: result.value.bytes,
      }));

    // Save to DB
    await Media.insertMany(uploadedFiles);

    const failedUploads = results
      .filter((result) => result.status === "rejected")
      .map((result) => result.reason.message);

    res.status(200).json({
      success: true,
      files: uploadedFiles,
      ...(failedUploads.length > 0 && { failed: failedUploads }),
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "File upload failed",
    });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const { public_id } = req.params;
    if (!public_id) {
      return res
        .status(400)
        .json({ success: false, error: "Missing public_id" });
    }

    await cloudinary.uploader.destroy(public_id);
    res.json({ success: true, message: "File deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// controllers/upload.controller.js
export const getMediaList = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5; // Default to 5 items
    const media = await Media.find()
      .limit(limit)
      .sort({ createdAt: -1 }) // Newest first
      .lean(); // Convert to plain JS objects

    res.json({
      success: true,
      data: media.map((item) => ({
        id: item._id.toString(), // Convert ObjectId to string
        url: item.url,
        title: item.title || "Untitled", // Default title
        tags: item.tags || [], // Default empty array
        date: item.createdAt.toLocaleDateString(), // Format date
      })),
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch media",
    });
  }
};

export const getMediaDetails = async (req, res) => {
  try {
    const media = await Media.findById(req.params.id);

    if (!media) {
      return res.status(404).json({
        success: false,
        error: "Media not found",
      });
    }

    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    console.error("Error getting media details:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch media details",
    });
  }
};
