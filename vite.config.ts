import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: '/ISA-Duel-RISC-vs-CISC-Simulator/',  // Add this for GitHub Pages
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],  // Removed lovable-tagger
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
