import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { completionsPost } from "@/api/completions";

const fetchMock = vi.fn();

global.fetch = fetchMock;

const messages = [{ role: "user", content: "hi" }];

const payload = {
    aiApiKey: "key",
    aiBaseUrl: "http://api/",
    aiModel: "model",
    messages: [{ role: "user", content: "hi" }],
};

describe("completions.ts", () => {
    beforeEach(() => {
        fetchMock.mockReset();
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("sends correct payload with defaults applied", async () => {
        fetchMock.mockResolvedValueOnce({
            json: async () => ({
                choices: [{ message: { content: "reply" } }],
            }),
        });
        const result = await completionsPost(payload);
        expect(fetchMock).toHaveBeenCalledTimes(1);
        const [, options] = fetchMock.mock.calls[0];
        const body = JSON.parse(options.body);
        expect(body.model).toBe("model");
        expect(body.messages.length).toBe(1);
        expect(body.max_tokens).toBeGreaterThan(0);
        expect(body.temperature).toBeGreaterThanOrEqual(0);
        expect(body.top_p).toBeGreaterThan(0);
        expect(result.content).toBe("reply");
    });

    test("preserves temperature zero", async () => {
        fetchMock.mockResolvedValueOnce({
            json: async () => ({
                choices: [{ message: { content: "ok" } }],
            }),
        });
        await completionsPost({ ...payload, aiTemperature: 0 });
        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.temperature).toBe(0);
    });

    test("clamps top_p to valid range", async () => {
        fetchMock.mockResolvedValueOnce({
            json: async () => ({
                choices: [{ message: { content: "ok" } }],
            }),
        });
        await completionsPost({ ...payload, aiTopP: 2 });
        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.top_p).toBe(1);
    });

    test("rejects zero max_tokens by fallback", async () => {
        fetchMock.mockResolvedValueOnce({
            json: async () => ({
                choices: [{ message: { content: "ok" } }],
            }),
        });
        await completionsPost({ ...payload, aiMaxTokens: 0 });
        const body = JSON.parse(fetchMock.mock.calls[0][1].body);
        expect(body.max_tokens).toBeGreaterThan(0);
    });

    test("uses full chat/completions endpoint", async () => {
        fetchMock.mockResolvedValueOnce({
            json: async () => ({
                choices: [{ message: { content: "ok" } }],
            }),
        });
        await completionsPost(payload);
        const [url] = fetchMock.mock.calls[0];
        expect(url).toBe("http://api/chat/completions");
    });

    test("throws on fetch failure", async () => {
        fetchMock.mockRejectedValueOnce(new Error("network"));
        await expect(completionsPost(payload)).rejects.toBeTruthy();
    });

    test("returns undefined if response has no choices", async () => {
        fetchMock.mockResolvedValueOnce({
            json: async () => ({}),
        });
        const result = await completionsPost(payload);
        expect(result).toBeUndefined();
    });
});
