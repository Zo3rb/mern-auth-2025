import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend runs on port 3000
    proxy: {
      "/api": {
        target: "http://localhost:5000", // Your Express server
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:5000", // For static files (avatars)
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "../server/public", // Build to server's public folder
  },
});
