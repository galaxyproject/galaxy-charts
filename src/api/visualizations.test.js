const mockPost = vi.fn();
const mockPut = vi.fn();

vi.mock("@/api/client", () => ({
    GalaxyApi: vi.fn(() => ({
        POST: mockPost,
        PUT: mockPut,
    })),
}));

import { describe, it, expect, vi, beforeEach } from "vitest";
import { visualizationsCreate, visualizationsUpdate, visualizationsSave } from "@/api/visualizations";

const config = {
    dataset_id: "ds123",
    settings: {},
    tracks: [],
};

beforeEach(() => {
    vi.resetAllMocks();
});

describe("visualizationsCreate", () => {
    it("returns the visualization id when successful", async () => {
        mockPost.mockResolvedValue({ data: { id: "viz42" } });
        const result = await visualizationsCreate("chart", "My Chart", config);
        expect(mockPost).toHaveBeenCalledWith("/api/visualizations", {
            type: "chart",
            title: "My Chart",
            config,
        });
        expect(result).toBe("viz42");
    });

    it("throws error on failure", async () => {
        mockPost.mockRejectedValue(new Error("Create failed"));
        await expect(visualizationsCreate("chart", "My Chart", config)).rejects.toThrow("Create failed");
    });
});

describe("visualizationsUpdate", () => {
    it("calls PUT with the correct payload", async () => {
        await visualizationsUpdate("id123", "Updated", config);
        expect(mockPut).toHaveBeenCalledWith("/api/visualizations/id123", {
            title: "Updated",
            config,
        });
    });

    it("throws error on failure", async () => {
        mockPut.mockRejectedValue(new Error("Update failed"));
        await expect(visualizationsUpdate("id123", "Updated", config)).rejects.toThrow("Update failed");
    });
});

describe("visualizationsSave", () => {
    it("calls visualizationsUpdate when id is present", async () => {
        await visualizationsSave("chart", "id999", "Saved Update", config);
        expect(mockPut).toHaveBeenCalledWith("/api/visualizations/id999", {
            title: "Saved Update",
            config,
        });
    });

    it("calls visualizationsCreate when id is null", async () => {
        mockPost.mockResolvedValue({ data: { id: "new-viz-id" } });
        const result = await visualizationsSave("chart", null, "New Viz", config);
        expect(mockPost).toHaveBeenCalledWith("/api/visualizations", {
            type: "chart",
            title: "New Viz",
            config,
        });
        expect(result).toBe("new-viz-id");
    });

    it("throws error when update fails", async () => {
        mockPut.mockRejectedValue(new Error("Save update failed"));
        await expect(visualizationsSave("chart", "id999", "Saved Update", config)).rejects.toThrow(
            "Save update failed",
        );
    });

    it("throws error when create fails", async () => {
        mockPost.mockRejectedValue(new Error("Save create failed"));
        await expect(visualizationsSave("chart", null, "New Viz", config)).rejects.toThrow("Save create failed");
    });
});
