import { datasetsGetColumns } from "@/api/datasets";
import { describe, it, expect, vi, beforeEach } from "vitest";

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

    it("should filter out invalid values and return correctly formatted data", async () => {
        const datasetId = "dataset1";
        const columnList = [0, 1];
        const mockResponse = {
            data: [
                ["Alanine", "Arginine"],
                [0.61, 2147483647], // 2147483647 should be removed
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
            ["Arginine"], // 2147483647 is removed
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
