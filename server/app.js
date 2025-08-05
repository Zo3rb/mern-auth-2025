import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/index.js";

// Import routes
import authRoutes from "./routes/auth.route.js";
import healthRoutes from "./routes/health.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust proxy for deployment platforms
app.set("trust proxy", 1);

// Dynamic CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, postman, etc.)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      "http://localhost:3000",
      "http://localhost:5173", // Vite dev server
      "http://localhost:5000",
      config.clientUrl,
      process.env.CLIENT_URL,
      process.env.FRONTEND_URL,
      process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
      process.env.RAILWAY_STATIC_URL
        ? `https://${process.env.RAILWAY_STATIC_URL}`
        : null,
      process.env.RENDER_EXTERNAL_URL,
    ].filter(Boolean);

    // Add common deployment patterns
    if (
      origin.includes("vercel.app") ||
      origin.includes("railway.app") ||
      origin.includes("render.com") ||
      origin.includes("herokuapp.com") ||
      origin.includes("netlify.app")
    ) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.log(`❌ CORS blocked origin: ${origin}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Security headers
app.use((req, res, next) => {
  res.header("X-Content-Type-Options", "nosniff");
  res.header("X-Frame-Options", "DENY");
  res.header("X-XSS-Protection", "1; mode=block");
  next();
});

// API routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);

// Serve static files in production
if (config.nodeEnv === "production") {
  const clientDistPath = path.join(__dirname, "../client/dist");

  // Serve static files
  app.use(express.static(clientDistPath));

  // API fallback
  app.get("/api/*", (req, res) => {
    res.status(404).json({
      success: false,
      error: "API endpoint not found",
    });
  });

  // Handle React routing - send all non-API requests to React app
  app.get("*", (req, res) => {
    res.sendFile(path.join(clientDistPath, "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.json({
      message: "🚀 MERN Auth API is running",
      version: "1.0.0",
      environment: config.nodeEnv,
      endpoints: {
        health: "/api/v1/health",
        auth: "/api/v1/auth",
      },
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(err.status || 500).json({
    success: false,
    error:
      config.nodeEnv === "production" ? "Something went wrong!" : err.message,
    ...(config.nodeEnv === "development" && { stack: err.stack }),
  });
});

export default app;
