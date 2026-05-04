import { describe, it, expect, vi, beforeEach } from "vitest";

const mockGet = vi.fn();

vi.mock("@/api/client", () => ({
    GalaxyApi: vi.fn(() => ({
        GET: mockGet,
    })),
}));

import { useDatasetStore } from "@/store/datasetStore";

describe("useDatasetStore", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches and caches dataset on first call", async () => {
        const mockDataset = { data: { id: "ds1", history_id: "hist1" }, response: {} };
        mockGet.mockResolvedValue(mockDataset);

        const { getDataset } = useDatasetStore();
        const result = await getDataset("ds1");

        expect(mockGet).toHaveBeenCalledWith("/api/datasets/ds1");
        expect(result).toEqual(mockDataset);
    });

    it("returns cached dataset on subsequent calls", async () => {
        const mockDataset = { data: { id: "ds2", history_id: "hist2" }, response: {} };
        mockGet.mockResolvedValue(mockDataset);

        const { getDataset } = useDatasetStore();

        await getDataset("ds2");
        await getDataset("ds2");
        await getDataset("ds2");

        expect(mockGet).toHaveBeenCalledTimes(1);
    });

    it("removes from cache and rethrows on error", async () => {
        const error = new Error("Network error");
        mockGet.mockRejectedValue(error);

        const { getDataset } = useDatasetStore();

        await expect(getDataset("ds-fail")).rejects.toThrow("Network error");

        // Second call should attempt fetch again (not cached)
        mockGet.mockRejectedValue(new Error("Still failing"));
        await expect(getDataset("ds-fail")).rejects.toThrow("Still failing");

        expect(mockGet).toHaveBeenCalledTimes(2);
    });
});
