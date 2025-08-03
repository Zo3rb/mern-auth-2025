import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
authRouter.post("/reg", registerUser);

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

export default authRouter;
