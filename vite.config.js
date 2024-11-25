import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import Checker from "vite-plugin-checker";

import path from "path";
import tailwindcss from "tailwindcss";
import vue from "@vitejs/plugin-vue";

import { viteConfigCharts } from "./vite.config.charts";

export default defineConfig({
    ...viteConfigCharts,
    build: {
        lib: {
            entry: path.resolve(__dirname, "lib/galaxy-charts.js"),
            name: "GalaxyCharts",
            fileName: "galaxy-charts",
        },
        rollupOptions: {
            external: ["vue"],
            output: {
                globals: { vue: "vue" },
            },
        },
    },
    plugins: [vue(), tailwindcss(), libInjectCss(), Checker({ typescript: true })],
    test: {
        globals: true,
        environment: "jsdom",
        exclude: [...configDefaults.exclude, "e2e/*"],
    },
});
