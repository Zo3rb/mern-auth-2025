import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
      "/uploads": {
        target: "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "dist", // ✅ Build to local dist folder (not ../server/public)
    emptyOutDir: true,
    assetsDir: "assets",
    sourcemap: false,
    minify: "terser",
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          router: ["react-router-dom"],
          redux: ["@reduxjs/toolkit", "react-redux", "redux-persist"],
        },
      },
    },
  },
  define: {
    "process.env.NODE_ENV": JSON.stringify(
      import.meta.env.MODE || "development"
    ),
  },
});
