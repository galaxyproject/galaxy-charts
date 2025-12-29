import { describe, it, expect, vi, beforeEach } from "vitest";
import { useColumnsStore } from "@/store/columnsStore";
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

    describe("checkColumns", () => {
        it("should return true for valid tracks", () => {
            const tracks = [{ x: "0", y: "1" }];
            const keys = ["x", "y"];
            expect(store.checkColumns(tracks, keys)).toBe(true);
        });

        it("should return false if a track is missing a key", () => {
            const tracks = [{ x: "0" }];
            const keys = ["x", "y"];
            expect(store.checkColumns(tracks, keys)).toBe(false);
        });

        it("should return false if a key has an empty string", () => {
            const tracks = [{ x: "0", y: "" }];
            const keys = ["x", "y"];
            expect(store.checkColumns(tracks, keys)).toBe(false);
        });

        it("should return false if a key is undefined", () => {
            const tracks = [{ x: "0", y: undefined }];
            const keys = ["x", "y"];
            expect(store.checkColumns(tracks, keys)).toBe(false);
        });

        it("should return true for multiple valid tracks", () => {
            const tracks = [
                { x: "0", y: "1" },
                { x: "2", y: "3" },
            ];
            const keys = ["x", "y"];
            expect(store.checkColumns(tracks, keys)).toBe(true);
        });
    });

    describe("getColumns", () => {
        it("should return unique column names from tracks", () => {
            const tracks = [
                { x: "col1", y: "col2" },
                { x: "col3", y: "col4" },
            ];
            const keys = ["x", "y"];
            expect(store.getColumns(tracks, keys)).toEqual(["col1", "col2", "col3", "col4"]);
        });

        it("should ignore duplicate column names", () => {
            const tracks = [
                { x: "col1", y: "col2" },
                { x: "col1", y: "col2" },
            ];
            const keys = ["x", "y"];
            expect(store.getColumns(tracks, keys)).toEqual(["col1", "col2"]);
        });

        it("should ignore columns that match SPECIAL_KEYS", () => {
            const tracks = [{ x: "auto", y: "col1" }, { x: "col2" }];
            const keys = ["x", "y"];
            expect(store.getColumns(tracks, keys)).toEqual(["col1", "col2"]); // "auto" is filtered out
        });

        it("should return an empty array when tracks are empty", () => {
            const tracks = [];
            const keys = ["x", "y"];
            expect(store.getColumns(tracks, keys)).toEqual([]);
        });

        it("should return an empty array when no keys are provided", () => {
            const tracks = [{ x: "col1" }, { y: "col2" }];
            const keys = [];
            expect(store.getColumns(tracks, keys)).toEqual([]);
        });

        it("should return an empty array when no valid columns exist", () => {
            const tracks = [{ x: "auto", y: "auto" }];
            const keys = ["x", "y"];
            expect(store.getColumns(tracks, keys)).toEqual([]);
        });

        it("should handle cases where tracks contain undefined values", () => {
            const tracks = [{ x: "col1", y: undefined }, { x: "col2" }];
            const keys = ["x", "y"];
            expect(store.getColumns(tracks, keys)).toEqual(["col1", "col2"]);
        });
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
