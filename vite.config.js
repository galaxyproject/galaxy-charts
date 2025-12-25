import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import Checker from "vite-plugin-checker";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
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
        cssInjectedByJsPlugin(),
        Checker({
            vueTsc: {
                tsconfigPath: path.resolve(__dirname, "tsconfig.json"),
                terminal: true,
                enableBuild: true,
            },
        }),
        dts({
            entry: path.resolve(__dirname, "lib/galaxy-charts.ts"),
            outDir: path.resolve(__dirname, "dist"),
            rollupTypes: true,
            tsConfigFilePath: path.resolve(__dirname, "tsconfig.json"),
            copyDtsFiles: false,
            include: ["lib/**/*", "src/**/*"],
            exclude: ["dist/**/*", "docs/**/*", "node_modules/**/*", "src/App.vue", "src/Plugin.vue"],
            logLevel: "debug",
        }),
    ],
    resolve: {
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
        globals: true,
        include: ["src/**/*.test.{js,ts,jsx,tsx}"],
    },
});
