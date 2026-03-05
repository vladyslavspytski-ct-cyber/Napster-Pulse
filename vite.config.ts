import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Check if running in Electron dev mode
const isElectronDev = process.env.VITE_IS_ELECTRON === 'true';

// Use different ports for web (5000) and Electron (5100) to avoid conflicts
const DEV_PORT = isElectronDev ? 5100 : 5173;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "0.0.0.0",
    port: DEV_PORT,
    strictPort: true, // Fail if port is already in use instead of trying another
    allowedHosts: true,
    open: !isElectronDev, // Don't open browser in Electron mode
    hmr: {
      overlay: false,
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
