import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  css: {
    transformer: "postcss",
    minify: "esbuild",
  },
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: "auto",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "masked-icon.svg"],
      manifest: {
        name: "School Management App",
        short_name: "SchoolApp",
        description: "School Attendance and Management System",
        start_url: "/",
        scope: "/",
        theme_color: "#361F1D",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            form_factor: "wide",
            label: "Desktop View",
          },
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            form_factor: "narrow",
            label: "Mobile View",
          },
        ],
      },
    }),
  ],
});