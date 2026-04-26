import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: {
      views: path.resolve(__dirname, "src/views"),
      components: path.resolve(__dirname, "src/components"),
      layout: path.resolve(__dirname, "src/layout"),
      pages: path.resolve(__dirname, "src/pages"),
      routes: path.resolve(__dirname, "src/routes"),
      themes: path.resolve(__dirname, "src/themes"),
      utils: path.resolve(__dirname, "src/utils"),
      assets: path.resolve(__dirname, "src/assets"),
      services: path.resolve(__dirname, "src/services"),
      "ui-component": path.resolve(__dirname, "src/ui-component"),
      "store": path.resolve(__dirname, "src/store"),
      "menu-items": path.resolve(__dirname, "src/menu-items"),
      "config": path.resolve(__dirname, "src/config"),
    },
  },
});