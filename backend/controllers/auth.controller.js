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

/**
 * Google OAuth authentication controller
 * Handles user authentication via Google OAuth
 */
export const googleAuth = async (req, res, next) => {
  const { name, email, photo } = req.body;

//✅ Add this line here to debug the Google profile photo
  console.log("Google photo URL:", photo);

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // Generate JWT token
      const token = jwt.sign(
        { _id: existingUser._id },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );

      // Return the user with avatar field
      const { password: pass, ...rest } = existingUser._doc;
      res
        .cookie("access_token", token, { httpOnly: true }) // Set cookie with token
        .status(200)
        .json(rest); // Return user data without password
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8); // Generate a random password
      const hashedPassword = await bcrypt.hash(generatedPassword, 12);

      // Create a new user with Google data
      const newUser = new User({
        username:
          req.body.name.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-4), // Convert name to lowercase without spaces
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();

      // Generate JWT token for new user
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      // Set HTTP-only cookie with token
      res
        .cookie("access_token", token, { httpOnly: true }) // Set cookie with token
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};