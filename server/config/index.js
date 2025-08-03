import dotenv from "dotenv";
dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/mern-auth",

  // JWT
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpire: process.env.JWT_EXPIRE || "30d",

  // CORS
  clientUrl: process.env.CLIENT_URL || "http://localhost:3000",

  // Email (if using email verification)
  emailFrom: process.env.EMAIL_FROM,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,

  // Social Auth (optional)
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,

  // Security
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
};

export default config;
