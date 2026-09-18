import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
export default defineConfig({
  base: process.env.DEPLOY_BASE_PATH || "/",
  resolve: { preserveSymlinks: true },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: "firebase-firestore", test: /@firebase[\\/]firestore/ },
            { name: "firebase-auth", test: /@firebase[\\/]auth/ },
            {
              name: "react-vendor",
              test: /node_modules[\\/](react|react-dom|react-router|react-router-dom|scheduler)[\\/]/,
            },
          ],
        },
      },
    },
  },
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./tests/setup.js"],
    env: { VITE_DATA_MODE: "demo" },
  },
});
