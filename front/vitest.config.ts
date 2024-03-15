import { defineConfig } from "vitest/config"
import checker from "vite-plugin-checker"
import Vue from "@vitejs/plugin-vue"
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins: [
    AutoImport({
      imports: ["vue"],
    }),
    checker({
      typescript: true
    }),
    Vue(),
  ],
  test: {
    globals: true,
    environment: "jsdom",
  },
})
