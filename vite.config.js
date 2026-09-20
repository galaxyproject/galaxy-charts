import { defineConfig } from "vite";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";
import Checker from "vite-plugin-checker";
import path from "path";
import tailwindcss from "@tailwindcss/vite";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import { viteConfigCharts } from "./vite.config.charts";
import { readFileSync, writeFileSync } from "fs";

/** Emit the input-type contract as JSON. */
function emitInputTypeRegistry() {
    return {
        name: "emit-input-type-registry",
        async closeBundle() {
            const { inputTypeRegistry } = await import("./src/schema/inputTypes.ts");
            const { version } = JSON.parse(readFileSync("./package.json", "utf8"));
            writeFileSync(
                path.resolve(__dirname, "dist/galaxy-charts.inputs.json"),
                JSON.stringify(inputTypeRegistry(version), null, 2) + "\n",
            );
        },
    };
}

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
        emitInputTypeRegistry(),
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
        setupFiles: ["./test.setup.js"],
        coverage: {
            enabled: true,
            reportsDirectory: "./coverage",
            reporter: ["text", "html", "lcov"],
            include: ["src/**/*.{ts,js,vue}"],
            provider: "istanbul",
        },
        environment: "happy-dom",
        globals: true,
        include: ["src/**/*.test.{js,ts,jsx,tsx}"],
    },
});
