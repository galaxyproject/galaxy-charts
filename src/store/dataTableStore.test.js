import { describe, it, expect, vi, beforeEach } from "vitest";
import { useDataTableStore } from "@/store/dataTableStore";
import { GalaxyApi } from "@/api/client";

vi.mock("@/api/client", () => ({
    GalaxyApi: vi.fn(),
}));

describe("useDataTableStore", () => {
    let store;
    let mockGet;

    beforeEach(() => {
        vi.clearAllMocks();
        mockGet = vi.fn();
        GalaxyApi.mockReturnValue({
            GET: mockGet,
        });
        store = useDataTableStore();
    });

    it("should parse a valid table with columns and fields", async () => {
        mockGet.mockResolvedValue({
            data: {
                columns: ["name", "value"],
                fields: [
                    ["label1", "val1"],
                    ["label2", "val2"],
                ],
            },
            response: {},
        });

        const result = await store.getDataTable("test");
        expect(mockGet).toHaveBeenCalledWith("/api/tool_data/test");
        expect(result).toEqual([
            {
                label: "label1",
                value: {
                    id: "val1",
                    columns: ["name", "value"],
                    row: ["label1", "val1"],
                    table: "test",
                },
            },
            {
                label: "label2",
                value: {
                    id: "val2",
                    columns: ["name", "value"],
                    row: ["label2", "val2"],
                    table: "test",
                },
            },
        ]);
    });

    it("should handle fields with missing columns gracefully", async () => {
        mockGet.mockResolvedValue({
            data: {
                columns: ["name", "value"],
                fields: [["label1"], ["label2"]],
            },
            response: {},
        });

        const result = await store.getDataTable("test-missing");
        expect(result).toEqual([
            {
                label: "label1",
                value: {
                    id: "label1",
                    columns: ["name", "value"],
                    row: ["label1"],
                    table: "test-missing",
                },
            },
            {
                label: "label2",
                value: {
                    id: "label2",
                    columns: ["name", "value"],
                    row: ["label2"],
                    table: "test-missing",
                },
            },
        ]);
    });

    it("should log a debug message when no data is returned", async () => {
        const debugSpy = vi.spyOn(console, "debug").mockImplementation(() => {});
        mockGet.mockResolvedValue({
            data: { columns: [], fields: [] },
            response: {},
        });

        const result = await store.getDataTable("empty");
        expect(debugSpy).toHaveBeenCalledWith("[charts] No data found in empty.");
        expect(result).toEqual([]);
        debugSpy.mockRestore();
    });

    it("should cache responses and avoid duplicate requests", async () => {
        mockGet.mockResolvedValueOnce({
            data: {
                columns: ["name", "value"],
                fields: [["row1", "rowVal"]],
            },
            response: {},
        });

        const first = await store.getDataTable("cached");
        const second = await store.getDataTable("cached");

        expect(mockGet).toHaveBeenCalledTimes(1);
        expect(second).toEqual(first);
    });

    it("should remove cache entry on failure", async () => {
        mockGet.mockRejectedValueOnce(new Error("network error"));
        await expect(store.getDataTable("bad")).rejects.toThrow("network error");
    });

    it("should remove duplicate rows by value.id and sort alphabetically", async () => {
        mockGet.mockResolvedValue({
            data: {
                columns: ["name", "value"],
                fields: [
                    ["labelB", "dup"],
                    ["labelA", "dup"],
                    ["labelC", "zzz"],
                ],
            },
            response: {},
        });

        const result = await store.getDataTable("dedup");
        expect(result).toEqual([
            {
                label: "labelB",
                value: {
                    id: "dup",
                    columns: ["name", "value"],
                    row: ["labelB", "dup"],
                    table: "dedup",
                },
            },
            {
                label: "labelC",
                value: {
                    id: "zzz",
                    columns: ["name", "value"],
                    row: ["labelC", "zzz"],
                    table: "dedup",
                },
            },
        ]);
        expect(result.map((r) => r.value.id)).toEqual(["dup", "zzz"]);
    });
});
