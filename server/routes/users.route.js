import express from "express";

import {
  getUserProfile,
  updateUserProfile,
} from "../controllers/users.controller.js";

const userRouter = express.Router();

/**
 * @desc    Get user profile
 * @route   GET /api/v1/auth/profile
 * @access  Private
 */
userRouter.get("/profile", getUserProfile);

/**
 * @desc    Update user profile
 * @route   PUT /api/v1/auth/profile
 * @access  Private
 */
userRouter.put("/profile", updateUserProfile);

export default userRouter;
