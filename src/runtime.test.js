import { describe, test, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(__dirname, "..");
const STATIC_IMPORT = /^\s*(?:import|export)\b[^;]*?from\s+"([^"]+)"/gm;

/** Every module a static import chain reaches from an entry. A dynamic import is not one. */
function staticGraph(entry) {
    const seen = new Set();
    const externals = new Set();
    const walk = (file) => {
        if (seen.has(file)) {
            return;
        }
        seen.add(file);
        const source = fs.readFileSync(file, "utf8");
        for (const [, target] of source.matchAll(STATIC_IMPORT)) {
            if (!target.startsWith("@/") && !target.startsWith(".")) {
                externals.add(target);
                continue;
            }
            const base = target.startsWith("@/")
                ? path.join(ROOT, "src", target.slice(2))
                : path.resolve(path.dirname(file), target);
            const resolved = [base, `${base}.ts`, `${base}.vue`, path.join(base, "index.ts")].find(
                (candidate) => fs.existsSync(candidate) && fs.statSync(candidate).isFile(),
            );
            if (resolved) {
                walk(resolved);
            }
        }
    };
    walk(entry);
    return { modules: [...seen].map((file) => path.relative(ROOT, file)), externals: [...externals] };
}

describe("the runtime entry stays headless", () => {
    const { modules, externals } = staticGraph(path.join(ROOT, "lib/galaxy-charts-runtime.ts"));

    test("nothing it reaches imports vue", () => {
        expect(externals).not.toContain("vue");
    });

    test("it reaches no component", () => {
        expect(modules.filter((file) => file.endsWith(".vue"))).toEqual([]);
    });

    test("the store-backed Galaxy client is reachable only on use", () => {
        // getOptions imports it with `await import`, so a caller supplying a ClientType never
        // loads configStore, which is the one module in this chain that needs vue.
        expect(modules).not.toContain(path.join("src", "api", "client.ts"));
        expect(modules).not.toContain(path.join("src", "store", "configStore.ts"));
    });

    test("it does reach the option resolution it exists to expose", () => {
        expect(modules).toContain(path.join("src", "store", "getOptions.ts"));
        expect(modules).toContain(path.join("src", "schema", "inputOptions.ts"));
    });
});
