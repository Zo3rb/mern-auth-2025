import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

// Importing Routes.
import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/users.route.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.middleware.js";

const app = express();

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory (correct path)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Serve React app in production
if (process.env.NODE_ENV === "production") {
  // Serve static files from React build
  app.use(express.static(path.join(__dirname, "public")));

  // Handle React routing - send all non-API requests to React
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
  });
}

// Application Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
