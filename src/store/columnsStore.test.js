import { describe, it, expect, vi, beforeEach } from "vitest";
import { useColumnsStore } from "./columnsStore";
import { datasetsGetColumns } from "@/api/datasets";

vi.mock("@/api/datasets", () => ({
    datasetsGetColumns: vi.fn(),
}));

describe("useColumnsStore", () => {
    let store;

    beforeEach(() => {
        vi.clearAllMocks();
        store = useColumnsStore();
    });

    it("should return a list of unique column names from tracks", () => {
        const tracks = [{ x: "col1" }, { y: "col2" }];
        const keys = ["x", "y"];
        const result = store.getColumns(tracks, keys);
        expect(result).toEqual(["col1", "col2"]);
    });

    it("should ignore duplicate column names", () => {
        const tracks = [{ x: "col1" }, { y: "col1" }, { x: "col2" }];
        const keys = ["x", "y"];
        const result = store.getColumns(tracks, keys);
        expect(result).toEqual(["col1", "col2"]);
    });

    it("should ignore columns that match SPECIAL_KEYS", () => {
        const tracks = [{ x: "auto" }, { y: "col1" }, { x: "col2" }];
        const keys = ["x", "y"];
        const result = store.getColumns(tracks, keys);
        expect(result).toEqual(["col1", "col2"]); // "auto" is filtered out
    });

    it("should return an empty array when tracks are empty", () => {
        const tracks = [];
        const keys = ["x", "y"];
        const result = store.getColumns(tracks, keys);
        expect(result).toEqual([]);
    });

    it("should return an empty array when no keys are provided", () => {
        const tracks = [{ x: "col1" }, { y: "col2" }];
        const keys = [];
        const result = store.getColumns(tracks, keys);
        expect(result).toEqual([]);
    });

    it("should return an empty array when no valid columns exist", () => {
        const tracks = [{ x: "auto" }, { y: "auto" }];
        const keys = ["x", "y"];
        const result = store.getColumns(tracks, keys);
        expect(result).toEqual([]);
    });

    it("should handle cases where tracks contain undefined values", () => {
        const tracks = [{ x: "col1" }, { x: "col2" }];
        const keys = ["x", "y"];
        const result = store.getColumns(tracks, keys);
        expect(result).toEqual(["col1", "col2"]);
    });

    it("should return formatted column data when all columns are available", async () => {
        const datasetId = "dataset1";
        const tracks = [
            { x: "0", y: "1" },
            { x: "1", y: "0" },
        ];
        const keys = ["x", "y"];
        datasetsGetColumns.mockResolvedValue([
            ["Alanine", "Arginine", "Asparagine"],
            [0.61, 0.6, 0.06],
        ]);
        const result = await store.fetchColumns(datasetId, tracks, keys);
        expect(datasetsGetColumns).toHaveBeenCalledWith(datasetId, ["0", "1"]);
        expect(result).toEqual([
            { x: ["Alanine", "Arginine", "Asparagine"], y: [0.61, 0.6, 0.06] },
            { x: [0.61, 0.6, 0.06], y: ["Alanine", "Arginine", "Asparagine"] },
        ]);
    });

    it("should return an empty array when tracks are empty", async () => {
        const datasetId = "dataset1";
        const tracks = [];
        const keys = ["x", "y"];
        const result = await store.fetchColumns(datasetId, tracks, keys);
        expect(result).toEqual([]);
        expect(datasetsGetColumns).not.toHaveBeenCalled();
    });

    it("should return an empty array when keys are empty", async () => {
        const datasetId = "dataset1";
        const tracks = [{ x: "0", y: "1" }];
        const keys = [];
        const result = await store.fetchColumns(datasetId, tracks, keys);
        expect(result).toEqual([]);
        expect(datasetsGetColumns).not.toHaveBeenCalled();
    });
});
