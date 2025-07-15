import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Custom plugin to handle URI malformed errors
const uriErrorHandler = () => {
  return {
    name: "uri-error-handler",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        try {
          // Decode URI safely
          if (req.url) {
            decodeURIComponent(req.url);
          }
          next();
        } catch (error) {
          if (error instanceof URIError) {
            console.warn("Malformed URI detected, skipping request:", req.url);
            res.statusCode = 400;
            res.end("Bad Request - Malformed URI");
            return;
          }
          next();
        }
      });
    },
  };
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), uriErrorHandler()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      "/api": {
        target: "http://localhost:3003",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    fs: {
      strict: false,
    },
  },
  resolve: {
    alias: {
      "@": "/src",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "INVALID_ANNOTATION") return;
        warn(warning);
      },
    },
  },
  define: {
    "process.env": {},
  },
});
