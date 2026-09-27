import { describe, test, expect, vi, beforeEach } from "vitest";
import { getCache, resetCache } from "@/store/getCache";

describe("getCache", () => {
    beforeEach(() => resetCache());

    test("produces once per key", async () => {
        const produce = vi.fn().mockResolvedValue("value");
        expect(await getCache("k", produce)).toBe("value");
        expect(await getCache("k", produce)).toBe("value");
        expect(produce).toHaveBeenCalledOnce();
    });

    test("different keys are independent", async () => {
        await getCache("a", () => Promise.resolve(1));
        expect(await getCache("b", () => Promise.resolve(2))).toBe(2);
        expect(await getCache("a", () => Promise.resolve(99))).toBe(1);
    });

    test("concurrent callers share one in-flight fetch", async () => {
        const produce = vi.fn().mockResolvedValue("value");
        await Promise.all([getCache("k", produce), getCache("k", produce)]);
        expect(produce).toHaveBeenCalledOnce();
    });

    test("a failure is not remembered, so the next call retries", async () => {
        const produce = vi.fn().mockRejectedValueOnce(new Error("nope")).mockResolvedValue("value");
        await expect(getCache("k", produce)).rejects.toThrow("nope");
        expect(await getCache("k", produce)).toBe("value");
        expect(produce).toHaveBeenCalledTimes(2);
    });

    test("reset forgets everything", async () => {
        const produce = vi.fn().mockResolvedValue("value");
        await getCache("k", produce);
        resetCache();
        await getCache("k", produce);
        expect(produce).toHaveBeenCalledTimes(2);
    });
});
