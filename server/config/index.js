import dotenv from "dotenv";

// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config();
}

const config = {
  // Server
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database - Dynamic MongoDB URI
  mongoUri:
    process.env.MONGO_URI ||
    process.env.MONGODB_URI ||
    "mongodb://localhost:27017/mern-auth",

  // JWT - Dynamic secrets
  jwtSecret:
    process.env.JWT_SECRET || "fallback-secret-key-change-in-production",
  jwtRefreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    process.env.JWT_SECRET ||
    "fallback-refresh-secret",
  jwtExpire: process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || "15m",
  jwtRefreshExpire:
    process.env.JWT_REFRESH_EXPIRE ||
    process.env.JWT_REFRESH_EXPIRES_IN ||
    "7d",

  // CORS - Dynamic client URL
  clientUrl:
    process.env.CLIENT_URL ||
    process.env.FRONTEND_URL ||
    "http://localhost:3000",

  // Security
  bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,

  // Optional features
  emailFrom: process.env.EMAIL_FROM,
  emailUser: process.env.EMAIL_USER,
  emailPass: process.env.EMAIL_PASS,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};

// Validation for required variables in production
if (config.nodeEnv === "production") {
  const requiredVars = ["MONGO_URI", "JWT_SECRET"];
  const missingVars = requiredVars.filter(
    (varName) =>
      !process.env[varName] &&
      !process.env[varName.replace("MONGO_URI", "MONGODB_URI")]
  );

  if (missingVars.length > 0) {
    console.error("❌ Missing required environment variables:", missingVars);
    process.exit(1);
  }
}

console.log(`🌍 Environment: ${config.nodeEnv}`);
console.log(
  `🗄️  Database: ${
    config.mongoUri.includes("mongodb+srv") ? "MongoDB Atlas" : "Local MongoDB"
  }`
);
console.log(`🔗 Client URL: ${config.clientUrl}`);

export default config;
