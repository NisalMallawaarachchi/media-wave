// controllers/dashboard.controller.js
import Media from '../models/media.model.js';
import User from '../models/user.model.js'; // If you have a user model

export const getDashboardStats = async (req, res) => {
  try {
    const [totalMedia, totalUsers] = await Promise.all([
      Media.countDocuments(),
      User.countDocuments(), // Remove if you don't have users
    ]);

    res.json({
      success: true,
      data: {
        totalMedia,
        totalUsers: totalUsers || 0, // Default to 0 if no user model
        unreadMessages: 0 // Implement later if needed
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};