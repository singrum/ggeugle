import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "My App",
        short_name: "App",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#ffffff",
        icons: [
          {
            src: "icons/icon192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icons/icon512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  worker: {
    plugins: () => [tsconfigPaths()],
  },
});
