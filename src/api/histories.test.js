import { historiesGetContents } from "@/api/histories";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { GalaxyApi } from "@/api/client";
import { rethrowSimple } from "@/utilities/simpleError";

vi.mock("@/api/client", () => ({
    GalaxyApi: vi.fn(),
}));

vi.mock("@/utilities/simpleError", () => ({
    rethrowSimple: vi.fn(),
}));

describe("historiesGetContents", () => {
    const mockGet = vi.fn();
    const historyId = "h1";

    beforeEach(() => {
        vi.clearAllMocks();
        GalaxyApi.mockReturnValue({ GET: mockGet });
    });

    it("should call API with correct query string and return data", async () => {
        const mockData = [{ id: "d1" }];
        mockGet.mockResolvedValue({ data: mockData });
        const result = await historiesGetContents(historyId, "abc", "bam", 50);
        expect(mockGet).toHaveBeenCalledWith(
            expect.stringContaining(`/api/histories/${historyId}/contents?v=dev&order=hid&`),
        );
        const callArg = mockGet.mock.calls[0][0];
        expect(callArg).toContain("q=deleted&qv=false");
        expect(callArg).toContain("q=visible&qv=true");
        expect(callArg).toContain("q=history_content_type&qv=dataset");
        expect(callArg).toContain("q=extension-eq&qv=bam");
        expect(callArg).toContain("q=name-contains&qv=abc");
        expect(callArg).toContain("limit=50");
        expect(result).toEqual(mockData);
    });

    it("should omit optional filters when not provided", async () => {
        const mockData = [{ id: "d2" }];
        mockGet.mockResolvedValue({ data: mockData });
        const result = await historiesGetContents(historyId);
        const callArg = mockGet.mock.calls[0][0];
        expect(callArg).not.toContain("q=extension-eq");
        expect(callArg).not.toContain("q=name-contains");
        expect(result).toEqual(mockData);
    });

    it("should return data directly from API", async () => {
        const mockData = [{ id: "xyz" }];
        mockGet.mockResolvedValue({ data: mockData });
        const result = await historiesGetContents(historyId);
        expect(result).toEqual(mockData);
    });

    it("should call rethrowSimple when API throws an error", async () => {
        const error = new Error("failure");
        mockGet.mockRejectedValue(error);
        await historiesGetContents(historyId);
        expect(rethrowSimple).toHaveBeenCalledWith(error);
    });
});
