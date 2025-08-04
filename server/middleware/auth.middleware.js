import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

import UserModel from "../models/user.model.js";
import config from "../config/index.js";

/**
 * @desc    Protect routes - Verify JWT token
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in cookies
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Check for token in Authorization header (Bearer token)
  if (
    !token &&
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  // Make sure token exists
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, config.jwtSecret);

    // Get user from the token and add to req object
    req.user = await UserModel.findById(decoded.userId);

    if (!req.user) {
      res.status(401);
      throw new Error("Not authorized, user not found");
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401);
    throw new Error("Not authorized, token failed");
  }
});

/**
 * @desc    Admin middleware - Check if user is admin
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 */
export const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as admin");
  }
});

/**
 * @desc    Verified user middleware - Check if user is verified
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 */
export const verified = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isVerified) {
    next();
  } else {
    res.status(403);
    throw new Error("Please verify your email to access this resource");
  }
});
