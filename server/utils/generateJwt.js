import jwt from "jsonwebtoken";
import config from "../config/index.js";

/**
 * Generate JWT token and set it as HTTP-only cookie
 * @param {Object} res - Express response object
 * @param {String} userId - User ID to include in token payload
 * @param {Object} additionalPayload - Additional data to include in token (optional)
 */
const generateTokenAndSetCookie = (res, userId, additionalPayload = {}) => {
  // Create token payload
  const payload = {
    userId,
    ...additionalPayload,
  };

  // Generate JWT token
  const token = jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });

  // Cookie options
  const cookieOptions = {
    httpOnly: true, // Prevent XSS attacks
    secure: config.nodeEnv === "production", // Use secure cookies in production
    sameSite: "strict", // Prevent CSRF attacks
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
  };

  // Set cookie
  res.cookie("jwt", token, cookieOptions);

  return token;
};

/**
 * Generate JWT token without setting cookie
 * @param {String} userId - User ID to include in token payload
 * @param {Object} additionalPayload - Additional data to include in token (optional)
 * @returns {String} JWT token
 */
const generateToken = (userId, additionalPayload = {}) => {
  const payload = {
    userId,
    ...additionalPayload,
  };

  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpire,
  });
};

/**
 * Clear JWT cookie
 * @param {Object} res - Express response object
 */
const clearTokenCookie = (res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
};

export { generateTokenAndSetCookie, generateToken, clearTokenCookie };
