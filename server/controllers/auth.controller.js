import asyncHandler from "express-async-handler";

import UserModel from "../models/user.model.js";
import {
  generateTokenAndSetCookie,
  clearTokenCookie,
} from "../utils/generateJwt.js";

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
export const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // Check if all required fields are provided
  if (!username || !email || !password || !confirmPassword) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  // Check if passwords match
  if (password !== confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match");
  }

  // Check if user already exists with the same email
  const existingUserByEmail = await UserModel.findOne({ email });
  if (existingUserByEmail) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  // Check if user already exists with the same username
  const existingUserByUsername = await UserModel.findOne({ username });
  if (existingUserByUsername) {
    res.status(400);
    throw new Error("User with this username already exists");
  }

  // Create new user
  const newUser = await UserModel.create({
    username,
    email,
    password,
    authType: "local",
  });

  // Generate JWT token and set cookie
  generateTokenAndSetCookie(res, newUser._id);

  // Return user data (password is already excluded by select: false)
  const userData = await UserModel.findById(newUser._id);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    data: {
      user: userData,
    },
  });
});

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error("Please provide email and password");
  }

  // Find user by email and include password field
  const user = await UserModel.findOne({ email }).select("+password");

  // Check if user exists and password is correct
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Update last login
  await user.updateLastLogin();

  // Generate JWT token and set cookie
  generateTokenAndSetCookie(res, user._id);

  // Return user data (without password)
  const userData = await UserModel.findById(user._id);

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: userData,
    },
  });
});

/**
 * @desc    Logout user and invalidate token
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
export const logoutUser = asyncHandler(async (req, res) => {
  // Clear the JWT cookie
  clearTokenCookie(res);

  res.json({
    success: true,
    message: "Logged out successfully",
    data: null,
  });
});

/**
 * @desc    Google sign-in/token handling
 * @route   POST /api/v1/auth/google
 * @access  Public
 */
export const googleAuth = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Google authentication endpoint - coming soon",
    data: null,
  });
});

/**
 * @desc    Get current logged-in user info
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
export const getCurrentUser = asyncHandler(async (req, res) => {
  // Get user from protect middleware (req.user should be available)
  const user = await UserModel.findById(req.user.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    success: true,
    message: "User data retrieved successfully",
    data: {
      user: user,
    },
  });
});

/**
 * @desc    Issue new access token using refresh token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
export const refreshToken = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Refresh token endpoint - coming soon",
    data: null,
  });
});

/**
 * @desc    Start password reset flow
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Forgot password endpoint - coming soon",
    data: null,
  });
});

/**
 * @desc    Set new password using reset token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Reset password endpoint - coming soon",
    data: null,
  });
});

/**
 * @desc    Verify user email address
 * @route   GET /api/v1/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    message: "Verify email endpoint - coming soon",
    data: null,
  });
});
