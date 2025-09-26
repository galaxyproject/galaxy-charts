import { defineConfig } from "vite";
import { configDefaults } from "vitest/config";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import Checker from "vite-plugin-checker";
import path from "path";
import tailwindcss from "tailwindcss";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { viteConfigCharts } from "./vite.config.charts";

export default defineConfig({
    ...viteConfigCharts,
    build: {
        lib: {
            entry: path.resolve(__dirname, "lib/galaxy-charts.ts"),
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
    plugins: [
        vue(),
        tailwindcss(),
        libInjectCss(),
        Checker({ typescript: true }),
        dts({
            // Explicitly specify the entry file
            entry: path.resolve(__dirname, "lib/galaxy-charts.ts"),
            // Output directory for .d.ts files
            outDir: path.resolve(__dirname, "dist"),
            // Combine types into a single file
            rollupTypes: true,
            // Use the correct tsconfig
            tsConfigFilePath: path.resolve(__dirname, "tsconfig.json"),
            // Skip copying .d.ts files
            copyDtsFiles: false,
            // Include all relevant files
            include: ["lib/**/*", "src/**/*"],
            // Exclude unnecessary files
            exclude: ["dist/**/*", "docs/**/*", "node_modules/**/*", "src/App.vue", "src/Plugin.vue"],
            // Enable debug logging
            logLevel: "debug",
        }),
    ],
    resolve: {
        // Ensure Vite respects tsconfig path aliases
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    test: {
        coverage: {
            enabled: true,
            reportsDirectory: "./coverage",
            reporter: ["text", "html", "lcov"],
            include: ["src/**/*.{ts,js,vue}"],
            provider: "istanbul",
        },
        environment: "jsdom",
        exclude: [...configDefaults.exclude, "e2e/*"],
        globals: true,
    },
});
