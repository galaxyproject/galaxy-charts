/** The headless entry, built apart from the component library so it carries no Vue. */
import { defineConfig } from "vite";
import path from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
    build: {
        emptyOutDir: false,
        lib: {
            entry: path.resolve(__dirname, "lib/galaxy-charts-runtime.ts"),
            fileName: "galaxy-charts.runtime",
            formats: ["es"],
        },
        rollupOptions: {
            // Left external so a leak fails loudly at import instead of bundling Vue in silently.
            external: ["vue"],
            // The default Galaxy client is imported only when no client is supplied; inlining it
            // here would pull that chain into the entry and defeat the point.
            output: { inlineDynamicImports: false },
        },
    },
    plugins: [
        dts({
            entry: path.resolve(__dirname, "lib/galaxy-charts-runtime.ts"),
            outDir: path.resolve(__dirname, "dist"),
            rollupTypes: true,
            tsConfigFilePath: path.resolve(__dirname, "tsconfig.json"),
            copyDtsFiles: false,
            include: ["lib/galaxy-charts-runtime.ts", "src/**/*.ts"],
            exclude: ["dist/**/*", "docs/**/*", "node_modules/**/*"],
        }),
    ],
    resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
