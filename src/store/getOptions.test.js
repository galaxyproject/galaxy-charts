import { describe, test, expect, vi, beforeEach } from "vitest";
import { GalaxyApi } from "@/api/client";
import { resetCache } from "@/store/getCache";
import { getOptions } from "@/store/getOptions";

vi.mock("@/api/client", () => ({ GalaxyApi: vi.fn() }));

const DATASET = { history_id: "h1", metadata_column_types: { 0: "str", 1: "int" } };

let mockGet;

beforeEach(() => {
    vi.clearAllMocks();
    resetCache();
    mockGet = vi.fn(async (path) => {
        if (path.startsWith("/api/datasets/")) {
            return { data: DATASET };
        }
        if (path === "/api/tool_data/hg") {
            return { data: { columns: ["name", "value"], fields: [["hg38", "hg38.fa"]] } };
        }
        if (path.includes("/contents")) {
            return { data: [{ id: "a1", extension: "bed", hid: 3, name: "peaks" }] };
        }
        throw new Error(`no route for ${path}`);
    });
    GalaxyApi.mockReturnValue({ GET: mockGet });
});

describe("getOptions", () => {
    test("a column input offers what the dataset allows", async () => {
        const options = await getOptions({ type: "data_column", is_number: "true" }, { datasetId: "d1" });
        expect(options).toEqual([{ label: "Column: 2", value: "1" }]);
    });

    test("with no dataset there is nothing to offer", async () => {
        expect(await getOptions({ type: "data_column" }, {})).toEqual([]);
        expect(await getOptions({ type: "data" }, {})).toEqual([]);
        expect(mockGet).not.toHaveBeenCalled();
    });

    test("a declared select needs no fetch", async () => {
        const input = { type: "select", data: [{ label: "Bar", value: "bar" }] };
        expect(await getOptions(input)).toEqual([{ label: "Bar", value: "bar" }]);
        expect(mockGet).not.toHaveBeenCalled();
    });

    test("a table input offers its rows", async () => {
        const options = await getOptions({ type: "data_table", tables: ["hg"] });
        expect(options).toEqual([
            {
                label: "hg38",
                value: { id: "hg38.fa", columns: ["name", "value"], row: ["hg38", "hg38.fa"], table: "hg" },
            },
        ]);
    });

    test("a table that cannot be read is skipped, leaving the others", async () => {
        const options = await getOptions({ type: "data_table", tables: ["missing", "hg"] });
        expect(options.map((option) => option.label)).toEqual(["hg38"]);
    });
});

describe("inputs that imply the same option set share one fetch", () => {
    test("column inputs with different filters share the dataset", async () => {
        await getOptions({ type: "data_column", is_number: "true" }, { datasetId: "d1" });
        await getOptions({ type: "data_column", is_text: "true" }, { datasetId: "d1" });
        await getOptions({ type: "data_column", is_auto: "true" }, { datasetId: "d1" });
        expect(mockGet).toHaveBeenCalledTimes(1);
    });

    test("different datasets do not share", async () => {
        await getOptions({ type: "data_column" }, { datasetId: "d1" });
        await getOptions({ type: "data_column" }, { datasetId: "d2" });
        expect(mockGet).toHaveBeenCalledTimes(2);
    });

    test("overlapping table declarations share the table they have in common", async () => {
        await getOptions({ type: "data_table", tables: ["hg"] });
        await getOptions({ type: "data_table", tables: ["hg", "missing"] });
        const tableCalls = mockGet.mock.calls.filter(([path]) => path === "/api/tool_data/hg");
        expect(tableCalls).toHaveLength(1);
    });

    test("two json inputs with the same url share their entries", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: "hg19" }] });
        await getOptions({ type: "data_json", url: "/genomes.json" });
        await getOptions({ type: "data_json", url: "/genomes.json" });
        expect(global.fetch).toHaveBeenCalledOnce();
    });

    test("different urls do not share", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: "hg19" }] });
        await getOptions({ type: "data_json", url: "/a.json" });
        await getOptions({ type: "data_json", url: "/b.json" });
        expect(global.fetch).toHaveBeenCalledTimes(2);
    });

    test("a search term is not part of the option set, so it is never cached", async () => {
        const options = { type: "data" };
        await getOptions(options, { datasetId: "d1", query: "peaks" });
        await getOptions(options, { datasetId: "d1", query: "genes" });
        const contentCalls = mockGet.mock.calls.filter(([path]) => path.includes("/contents"));
        expect(contentCalls).toHaveLength(2);
        expect(contentCalls[0][0]).toContain("peaks");
        expect(contentCalls[1][0]).toContain("genes");
        expect(mockGet.mock.calls.filter(([path]) => path.startsWith("/api/datasets/"))).toHaveLength(1);
    });
});

describe("getOptions chooses nothing", () => {
    test("it reports the set and leaves selection to the caller", async () => {
        const input = { type: "data_column", is_number: "true" };
        const first = await getOptions(input, { datasetId: "d1" });
        const second = await getOptions(input, { datasetId: "d1" });
        expect(second).toEqual(first);
        expect(first.every((option) => Object.keys(option).sort().join() === "label,value")).toBe(true);
    });
});

describe("a lookup that fails says so", () => {
    test("a json url that answers badly rejects rather than reporting no options", async () => {
        global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
        await expect(getOptions({ type: "data_json", url: "/broken.json" })).rejects.toThrow("500");
    });

    test("a rejected lookup is not remembered, so a retry can succeed", async () => {
        global.fetch = vi
            .fn()
            .mockResolvedValueOnce({ ok: false, status: 503 })
            .mockResolvedValue({ ok: true, json: async () => [{ id: "hg19" }] });
        const input = { type: "data_json", url: "/flaky.json" };
        await expect(getOptions(input)).rejects.toThrow();
        expect(await getOptions(input)).toEqual([{ label: "hg19", value: { id: "hg19" } }]);
    });

    test("a dataset that cannot be read rejects", async () => {
        mockGet.mockRejectedValue(new Error("gone"));
        await expect(getOptions({ type: "data_column" }, { datasetId: "d1" })).rejects.toThrow("gone");
    });

    test("json entries map to options", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => [{ id: "1", name: "Item1" }, { id: "2" }],
        });
        expect(await getOptions({ type: "data_json", url: "/entries.json" })).toEqual([
            { label: "Item1", value: { id: "1", name: "Item1" } },
            { label: "2", value: { id: "2" } },
        ]);
    });
});

describe("a supplied client owns the transport", () => {
    const stub = () => ({
        api: vi.fn(async (path) => {
            if (path.startsWith("api/datasets/")) {
                return DATASET;
            }
            if (path === "api/tool_data/hg") {
                return { columns: ["name", "value"], fields: [["hg38", "hg38.fa"]] };
            }
            if (path.includes("/contents")) {
                return [{ id: "a1", extension: "bed", hid: 3, name: "peaks" }];
            }
            throw new Error(`no route for ${path}`);
        }),
        url: vi.fn(async () => [{ id: "hg19" }]),
    });

    test("galaxy-charts' own client is not used", async () => {
        const client = stub();
        const options = await getOptions({ type: "data_table", tables: ["hg"] }, { client });
        expect(options[0].label).toBe("hg38");
        expect(client.api).toHaveBeenCalledOnce();
        expect(mockGet).not.toHaveBeenCalled();
    });

    test("api paths carry no leading slash", async () => {
        const client = stub();
        await getOptions({ type: "data_column" }, { client, datasetId: "d1" });
        await getOptions({ type: "data" }, { client, datasetId: "d1" });
        for (const [path] of client.api.mock.calls) {
            expect(path.startsWith("api/")).toBe(true);
        }
    });

    test("a declared url goes to url, not api", async () => {
        const client = stub();
        const options = await getOptions({ type: "data_json", url: "/genomes.json" }, { client });
        expect(client.url).toHaveBeenCalledWith("/genomes.json");
        expect(client.api).not.toHaveBeenCalled();
        expect(options).toEqual([{ label: "hg19", value: { id: "hg19" } }]);
    });

    test("a declared select needs no client at all", async () => {
        const client = stub();
        const input = { type: "select", data: [{ label: "Bar", value: "bar" }] };
        expect(await getOptions(input, { client })).toEqual([{ label: "Bar", value: "bar" }]);
        expect(client.api).not.toHaveBeenCalled();
        expect(client.url).not.toHaveBeenCalled();
    });

    test("the client's failure reaches the caller", async () => {
        const client = stub();
        client.url.mockRejectedValue(new Error("no route to host"));
        await expect(getOptions({ type: "data_json", url: "/x.json" }, { client })).rejects.toThrow(
            "no route to host",
        );
    });

    test("galaxy-charts still owns the caching", async () => {
        const client = stub();
        const input = { type: "data_column", is_number: "true" };
        await getOptions(input, { client, datasetId: "d1" });
        await getOptions({ type: "data_column", is_text: "true" }, { client, datasetId: "d1" });
        expect(client.api).toHaveBeenCalledOnce();
    });

    test("a dataset with no history is refused, not asked for with an empty path", async () => {
        const client = stub();
        client.api.mockImplementation(async (path) => {
            if (path.startsWith("api/datasets/")) {
                return { id: "d1" };
            }
            throw new Error(`no route for ${path}`);
        });
        await expect(getOptions({ type: "data" }, { client, datasetId: "d1" })).rejects.toThrow(
            "reports no history",
        );
        expect(client.api.mock.calls.every(([path]) => !path.includes("//"))).toBe(true);
    });

    test("history contents are asked for through the same client", async () => {
        const client = stub();
        const options = await getOptions({ type: "data" }, { client, datasetId: "d1" });
        expect(options).toEqual([
            { label: "3: peaks", value: { id: "a1", extension: "bed", hid: 3, name: "peaks" } },
        ]);
        expect(client.api.mock.calls.map(([path]) => path.split("?")[0])).toEqual([
            "api/datasets/d1",
            "api/histories/h1/contents",
        ]);
    });
});
