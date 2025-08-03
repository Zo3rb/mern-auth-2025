import express from "express";

import { getHealthStatus } from "../controllers/health.controller.js";

const healthRouter = express.Router();

healthRouter.get("/health", getHealthStatus);

export default healthRouter;
