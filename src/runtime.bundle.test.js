import { describe, test, expect } from "vitest";
import path from "node:path";
import { build } from "vite";

const ROOT = path.join(__dirname, "..");

/** Fails the build if anything in the graph asks for vue, however it asks. */
function refuseVue() {
    return {
        name: "refuse-vue",
        // Ahead of vite's own resolver, which would otherwise resolve vue and inline it.
        enforce: "pre",
        resolveId(source) {
            if (source === "vue" || source.startsWith("vue/")) {
                throw new Error(`the runtime entry reached ${source}`);
            }
            return null;
        },
    };
}

describe("a consumer can bundle the runtime entry with no vue installed", () => {
    test("bundling lib/galaxy-charts-runtime.ts never resolves vue", async () => {
        const bundled = await build({
            configFile: false,
            logLevel: "silent",
            resolve: { alias: { "@": path.join(ROOT, "src") } },
            plugins: [refuseVue()],
            build: {
                write: false,
                target: "es2022",
                lib: { entry: path.join(ROOT, "lib/galaxy-charts-runtime.ts"), formats: ["es"] },
            },
        });
        const [{ output }] = [].concat(bundled);
        const chunks = output.filter((chunk) => chunk.type === "chunk");
        expect(chunks.map((chunk) => chunk.code).join("").includes("getOptions")).toBe(true);
        // Nothing left to resolve at the consumer's end either.
        expect(chunks.flatMap((chunk) => chunk.imports ?? [])).toEqual([]);
    }, 60_000);
});
