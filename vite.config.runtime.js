/** The headless entry, built apart from the component library so it carries no Vue. */
import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        emptyOutDir: false,
        lib: {
            entry: path.resolve(import.meta.dirname, "lib/galaxy-charts-runtime.ts"),
            fileName: "galaxy-charts.runtime",
            formats: ["es"],
        },
        rollupOptions: {
            // Left external so a leak fails loudly at import instead of bundling Vue in silently.
            external: ["vue"],
        },
    },
    plugins: [
        // Per-file declarations in their own directory. A rolled-up file would be named after
        // package.json's "types", which is the component library's, and would skip or overwrite it.
        dts({
            outDir: path.resolve(import.meta.dirname, "dist/galaxy-charts-runtime-types"),
            rollupTypes: false,
            tsConfigFilePath: path.resolve(import.meta.dirname, "tsconfig.json"),
            copyDtsFiles: false,
            include: ["lib/galaxy-charts-runtime.ts", "src/**/*.ts"],
            exclude: ["dist/**/*", "docs/**/*", "node_modules/**/*", "src/**/*.test.*"],
        }),
    ],
    resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
});
