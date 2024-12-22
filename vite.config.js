import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "http://34.92.164.246:9090",
        changeOrigin: true,
        secure: false,
      },
      "/query": {
        target:
          "https://9ae9-2402-800-61cd-5f7d-78b6-e1fa-400e-22f0.ngrok-free.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
