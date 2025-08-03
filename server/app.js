import express from "express";

// Importing Routes.
import healthRouter from "./routes/health.route.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/users.route.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.middleware.js";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1", healthRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);

// Application Error Handlers
app.use(notFound);
app.use(errorHandler);

export default app;
