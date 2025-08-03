import http from "http";
import app from "./app.js";
import config from "./config/index.js";

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
  });
});
