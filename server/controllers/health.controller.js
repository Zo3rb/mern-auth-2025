import config from "../config/index.js";

export const getHealthStatus = (req, res) => {
  const healthData = {
    status: "UP",
    timestamp: new Date().toISOString(),
    service: "MERN Auth API",
    version: "1.0.0",
    environment: config.nodeEnv,
    port: config.port,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + " MB",
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + " MB",
    },
    endpoints: {
      health: "/health",
      api: "/api/v1",
    },
    database: {
      status: "Connected",
      uri: config.mongoUri.replace(/\/\/.*@/, "//***:***@"), // Hide credentials
    },
  };

  res.status(200).json(healthData);
};
