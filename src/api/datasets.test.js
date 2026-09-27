import { datasetsGetColumns } from "@/api/datasets";
import { describe, it, test, expect, vi, beforeEach } from "vitest";

global.fetch = vi.fn();

describe("datasetsGetColumns", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return formatted column data when API call is successful", async () => {
        const datasetId = "dataset1";
        const columnList = [0, 1, 4];
        const mockResponse = {
            data: [
                ["Alanine", 0.61, 1.56, 0.357, 52.6, 91.5, 1.42, 0.83],
                ["Arginine", 0.6, 0.45, 0.529, 109.1, 202, 0.98, 0.93],
                ["Asparagine", 0.06, 0.27, 0.463, 75.7, 135.2, 0.67, 0.89],
            ],
        };
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });
        const result = await datasetsGetColumns(datasetId, columnList);
        expect(fetch).toHaveBeenCalledWith(
            expect.stringContaining(`/api/datasets/${datasetId}?`),
            expect.objectContaining({ method: "GET" }),
        );
        expect(result).toEqual([
            ["Alanine", "Arginine", "Asparagine"],
            [0.61, 0.6, 0.06],
            [1.56, 0.45, 0.27],
        ]);
    });

    it("keeps every row's value, so columns of one dataset are the same length", async () => {
        // This asserted that 2147483647 was dropped from its column while the other column kept
        // its row, which is the desynchronisation itself: the shorter column then paired each
        // later value with the wrong row.
        const datasetId = "dataset1";
        const columnList = [0, 1];
        const mockResponse = {
            data: [
                ["Alanine", "Arginine"],
                [0.61, 2147483647],
            ],
        };
        fetch.mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        });
        const result = await datasetsGetColumns(datasetId, columnList);
        expect(fetch).toHaveBeenCalled();
        expect(result).toEqual([
            ["Alanine", 0.61],
            ["Arginine", 2147483647],
        ]);
    });

    it("should return an empty array when API returns no data", async () => {
        const datasetId = "dataset1";
        const columnList = [0];
        fetch.mockResolvedValue({
            ok: true,
            json: async () => ({ data: [] }),
        });
        const result = await datasetsGetColumns(datasetId, columnList);
        expect(fetch).toHaveBeenCalled();
        expect(result).toEqual([]);
    });

    it("should throw an error when API call fails", async () => {
        const datasetId = "dataset1";
        const columnList = [0, 1];
        fetch.mockRejectedValue(new Error("API Error"));
        await expect(datasetsGetColumns(datasetId, columnList)).rejects.toThrow("API Error");
        expect(fetch).toHaveBeenCalled();
    });
});

describe("column rows stay aligned", () => {
    // A cell equal to 2147483647 used to be filtered out of its own column while every other
    // column kept its row, so the series desynchronised and each later point was drawn against
    // the wrong x. Fixture: `a 10 / b 2147483647 / c 30 / d 40`, measured on Galaxy 26.2.
    const rows = [
        ["a", 10],
        ["b", 2147483647],
        ["c", 30],
        ["d", 40],
    ];

    function serving(data) {
        globalThis.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve({ data }),
        });
    }

    test("keeps 2147483647 as the value it is", async () => {
        serving(rows);
        const [x, y] = await datasetsGetColumns("d1", ["0", "1"]);
        expect(x).toEqual(["a", "b", "c", "d"]);
        expect(y).toEqual([10, 2147483647, 30, 40]);
        expect(x).toHaveLength(y.length);
    });

    test("pairs every x with the y from its own row", async () => {
        serving(rows);
        const [x, y] = await datasetsGetColumns("d1", ["0", "1"]);
        expect(x.map((value, index) => [value, y[index]])).toEqual([
            ["a", 10],
            ["b", 2147483647],
            ["c", 30],
            ["d", 40],
        ]);
    });

    test("keeps a null for a cell Galaxy could not read, so the gap stays in place", async () => {
        // The provider answers null for an empty cell, a literal NA and a ragged row alike.
        serving([
            ["a", 10],
            ["b", null],
            ["c", 30],
        ]);
        const [x, y] = await datasetsGetColumns("d1", ["0", "1"]);
        expect(y).toEqual([10, null, 30]);
        expect(x).toHaveLength(y.length);
    });
});
