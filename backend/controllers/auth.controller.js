import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../middlewares/error.js";

/**
 * User signup controller
 * Handles new user registration with email/password
 */
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(errorHandler("Invalid email format!", 400));
    }

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler("Email already exists!", 400));
    }

    // Hash password with bcrypt (12 rounds of salting)
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user with hashed password
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res
      .status(201)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};
