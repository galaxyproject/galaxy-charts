import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDataJsonStore } from "@/store/dataJsonStore";

describe("useDataJsonStore", () => {
    let store;
    beforeEach(() => {
        vi.clearAllMocks();
        store = useDataJsonStore();
        store.resetDataJson();
    });

    it("should parse a valid JSON response", async () => {
        const mockResponse = { ok: true, json: vi.fn().mockResolvedValue([{ id: "1", name: "Item1" }, { id: "2" }]) };
        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const result = await store.getDataJson("/test.json");
        expect(global.fetch).toHaveBeenCalledWith("/test.json");
        expect(result).toEqual([
            { label: "Item1", value: { id: "1", name: "Item1" } },
            { label: "2", value: { id: "2" } },
        ]);
    });

    it("should return empty array for non-ok response", async () => {
        const mockResponse = { ok: false };
        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const result = await store.getDataJson("/fail.json");
        expect(result).toEqual([]);
    });

    it("should remove cache on fetch error", async () => {
        const error = new Error("network error");
        global.fetch = vi.fn().mockRejectedValue(error);
        const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});

        const result = await store.getDataJson("/error.json");
        expect(result).toEqual([]);
        debugSpy.mockRestore();
    });

    it("should cache responses and avoid duplicate fetches", async () => {
        const mockResponse = { ok: true, json: vi.fn().mockResolvedValue([{ id: "1" }]) };
        global.fetch = vi.fn().mockResolvedValue(mockResponse);

        const first = await store.getDataJson("/cache.json");
        const second = await store.getDataJson("/cache.json");
        expect(global.fetch).toHaveBeenCalledTimes(1);
        expect(second).toEqual(first);
    });
});
