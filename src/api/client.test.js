import { describe, it, expect, vi, beforeEach } from "vitest";

vi.stubGlobal("fetch", vi.fn());

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe("GalaxyApi queue behavior", () => {
    let GalaxyApi;

    beforeEach(async () => {
        // Reset fetch mock for each test
        fetch.mockReset();

        // Inline mock setup before import
        vi.doMock("@/store/configStore", () => {
            return {
                useConfigStore: () => ({
                    getRoot: () => "https://api.example.com/",
                    getCredentials: () => "include",
                }),
            };
        });

        // Now dynamically import GalaxyApi *after* the mock is in place
        GalaxyApi = (await import("./client")).GalaxyApi;
    });

    it("should queue requests and process them one at a time", async () => {
        const log = [];
        fetch.mockImplementation(async (url, options) => {
            log.push(`start-${options.method}`);
            await delay(50);
            log.push(`end-${options.method}`);
            return {
                ok: true,
                json: async () => ({ success: true }),
            };
        });
        const api = GalaxyApi();
        const results = await Promise.all([
            api.GET("/one"),
            api.POST("/two", { foo: "bar" }),
            api.PUT("/three", { id: 3 }),
        ]);
        expect(results[0].data.success).toBe(true);
        expect(results[1].data.success).toBe(true);
        expect(results[2].data.success).toBe(true);
        expect(log).toEqual(["start-GET", "end-GET", "start-POST", "end-POST", "start-PUT", "end-PUT"]);
    });

    it("should propagate fetch errors to consumer", async () => {
        fetch.mockImplementation(async () => {
            throw new Error("Network failed");
        });
        const api = GalaxyApi();
        await expect(api.GET("/fail")).rejects.toThrow("Network failed");
    });

    it("should propagate HTTP errors to consumer", async () => {
        fetch.mockImplementation(async () => {
            return {
                ok: false,
                status: 500,
                statusText: "Internal Server Error",
            };
        });
        const api = GalaxyApi();
        await expect(api.POST("/fail", {})).rejects.toThrow("Request failed.");
    });
});
