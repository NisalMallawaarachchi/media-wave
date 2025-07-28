import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import errorHandler from "../middlewares/error.js";
import jwt from "jsonwebtoken";

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


/**
 * User signin controller
 * Handles existing user login with email/password
 */
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return next(errorHandler("Invalid email format!", 400));
    }

    // Find user by email
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler("User not found!", 404));
    }

    // Compare provided password with stored hash
    const validPassword = await bcrypt.compare(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler("Invalid credentials!", 401));
    }

    // Create JWT token with user ID, expires in 1 hour
    const token = jwt.sign({ _id: validUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const { password: pass, ...rest } = validUser._doc; // Exclude password from response

    // Set HTTP-only cookie with the token
    res.cookie("access_token", token, {
      httpOnly: true, // Prevents client-side JS access
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict", // CSRF protection
      maxAge: 60 * 60 * 1000, // 1 hour expiration
    });

    // Return token and user data (without password)
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};