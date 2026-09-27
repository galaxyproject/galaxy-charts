import { historiesGetContents } from "@/api/histories";
import { describe, it, expect, vi, beforeEach } from "vitest";

describe("historiesGetContents", () => {
    const api = vi.fn();
    const client = { api, url: vi.fn() };
    const historyId = "h1";

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should call API with correct query string and return data", async () => {
        const mockData = [{ id: "d1" }];
        api.mockResolvedValue(mockData);
        const result = await historiesGetContents(client, historyId, "abc", "bam", 50);
        expect(api).toHaveBeenCalledWith(
            expect.stringContaining(`api/histories/${historyId}/contents?v=dev&order=hid&`),
        );
        const callArg = api.mock.calls[0][0];
        expect(callArg).toContain("q=deleted&qv=false");
        expect(callArg).toContain("q=visible&qv=true");
        expect(callArg).toContain("q=history_content_type&qv=dataset");
        expect(callArg).toContain("q=extension-in&qv=bam");
        expect(callArg).toContain("q=name-contains&qv=abc");
        expect(callArg).toContain("limit=50");
        expect(result).toEqual(mockData);
    });

    it("should omit optional filters when not provided", async () => {
        const mockData = [{ id: "d2" }];
        api.mockResolvedValue(mockData);
        const result = await historiesGetContents(client, historyId);
        const callArg = api.mock.calls[0][0];
        expect(callArg).not.toContain("q=extension-in");
        expect(callArg).not.toContain("q=name-contains");
        expect(result).toEqual(mockData);
    });

    it("asks for no leading slash, so a caller's own client can route it", async () => {
        api.mockResolvedValue([]);
        await historiesGetContents(client, historyId);
        expect(api.mock.calls[0][0].startsWith("api/")).toBe(true);
    });

    it("lets the client's failure reach the caller", async () => {
        const error = new Error("failure");
        api.mockRejectedValue(error);
        await expect(historiesGetContents(client, historyId)).rejects.toThrow("failure");
    });
});
