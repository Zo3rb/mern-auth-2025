import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  getCurrentUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  verifyEmail,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
authRouter.post("/register", registerUser);

/**
 * @desc    Authenticate user and get token
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
authRouter.post("/login", loginUser);

/**
 * @desc    Logout user and invalidate token
 * @route   POST /api/v1/auth/logout
 * @access  Private
 */
authRouter.post("/logout", logoutUser);

/**
 * @desc    Google sign-in/token handling
 * @route   POST /api/v1/auth/google
 * @access  Public
 */
authRouter.post("/google", googleAuth);

/**
 * @desc    Get current logged-in user info
 * @route   GET /api/v1/auth/me
 * @access  Private
 */
authRouter.get("/me", getCurrentUser);

/**
 * @desc    Issue new access token using refresh token
 * @route   POST /api/v1/auth/refresh-token
 * @access  Public
 */
authRouter.post("/refresh-token", refreshToken);

/**
 * @desc    Start password reset flow
 * @route   POST /api/v1/auth/forgot-password
 * @access  Public
 */
authRouter.post("/forgot-password", forgotPassword);

/**
 * @desc    Set new password using reset token
 * @route   POST /api/v1/auth/reset-password
 * @access  Public
 */
authRouter.post("/reset-password", resetPassword);

/**
 * @desc    Verify user email address
 * @route   GET /api/v1/auth/verify-email/:token
 * @access  Public
 */
authRouter.get("/verify-email/:token", verifyEmail);

export default authRouter;
