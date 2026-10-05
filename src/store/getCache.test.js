import { describe, test, expect, vi, beforeEach } from "vitest";
import { getCache, resetCache } from "@/store/getCache";

const OWNER = {};

describe("getCache", () => {
    beforeEach(() => resetCache());

    test("produces once per key", async () => {
        const produce = vi.fn().mockResolvedValue("value");
        expect(await getCache(OWNER, "k", produce)).toBe("value");
        expect(await getCache(OWNER, "k", produce)).toBe("value");
        expect(produce).toHaveBeenCalledOnce();
    });

    test("different keys are independent", async () => {
        await getCache(OWNER, "a", () => Promise.resolve(1));
        expect(await getCache(OWNER, "b", () => Promise.resolve(2))).toBe(2);
        expect(await getCache(OWNER, "a", () => Promise.resolve(99))).toBe(1);
    });

    test("concurrent callers share one in-flight fetch", async () => {
        const produce = vi.fn().mockResolvedValue("value");
        await Promise.all([getCache(OWNER, "k", produce), getCache(OWNER, "k", produce)]);
        expect(produce).toHaveBeenCalledOnce();
    });

    test("a failure is not remembered, so the next call retries", async () => {
        const produce = vi.fn().mockRejectedValueOnce(new Error("nope")).mockResolvedValue("value");
        await expect(getCache(OWNER, "k", produce)).rejects.toThrow("nope");
        expect(await getCache(OWNER, "k", produce)).toBe("value");
        expect(produce).toHaveBeenCalledTimes(2);
    });

    test("each owner keeps its own entries", async () => {
        const other = {};
        await getCache(OWNER, "k", () => Promise.resolve("mine"));
        expect(await getCache(other, "k", () => Promise.resolve("theirs"))).toBe("theirs");
        expect(await getCache(OWNER, "k", () => Promise.resolve("again"))).toBe("mine");
    });

    test("reset forgets everything", async () => {
        const produce = vi.fn().mockResolvedValue("value");
        await getCache(OWNER, "k", produce);
        resetCache();
        await getCache(OWNER, "k", produce);
        expect(produce).toHaveBeenCalledTimes(2);
    });
});
