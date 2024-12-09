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
          "https://93e3-2402-800-61cd-5f7d-dce8-b085-5c46-4d74.ngrok-free.app",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
