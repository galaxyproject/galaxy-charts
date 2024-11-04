import { defineConfig } from "vite";
import tailwindcss from "tailwindcss";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import { configDefaults } from "vitest/config";

// collect Galaxy server root
let GALAXY_ROOT = "http://127.0.0.1:8080";
if (process.env.GALAXY_ROOT) {
    GALAXY_ROOT = process.env.GALAXY_ROOT;
} else {
    console.log("GALAXY_ROOT not available. Please provide as environment variable.");
}

// collect Galaxy API key
let GALAXY_KEY = "";
if (process.env.GALAXY_KEY) {
    GALAXY_KEY = process.env.GALAXY_KEY;
} else {
    console.log("GALAXY_KEY not available. Please provide as environment variable.");
}

// https://vitejs.dev/config/
export default defineConfig({
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
    define: {
        "process.env.credentials": JSON.stringify(GALAXY_KEY ? "omit" : "include"),
    },
    plugins: [vue(), tailwindcss(), libInjectCss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "src"),
        },
    },
    server: {
        proxy: {
            "/api": {
                changeOrigin: true,
                rewrite: (path) => {
                    if (GALAXY_KEY) {
                        const separator = path.includes("?") ? "&" : "?";
                        return `${path}${separator}key=${GALAXY_KEY}`;
                    } else {
                        return path;
                    }
                },
                target: GALAXY_ROOT,
            },
        },
    },
    test: {
        globals: true,
        environment: "jsdom",
        exclude: configDefaults.exclude,
    },
});
