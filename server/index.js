import http from "http";
import app from "./app.js";
import config from "./config/index.js";
import connectDB from "./config/dbConnect.js";

const server = http.createServer(app);

// Connect to database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log("[DATABASE]: MongoDB connection established successfully");

    // Start server
    server.listen(config.port, () => {
      console.log(`[SERVER]: Server running on port ${config.port}`);
      console.log(`[SERVER]: Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error("[SERVER]: Failed to start server:", error.message);
    process.exit(1);
  }
};

// Start the application
startServer();

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("[SERVER]: SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("[SERVER]: Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("[SERVER]: SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("[SERVER]: Process terminated");
  });
});
