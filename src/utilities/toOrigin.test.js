import { describe, test, expect } from "vitest";
import { toOrigin } from "@/utilities/toOrigin";

describe("toOrigin", () => {
    test("takes the origin of an absolute url, dropping its path", () => {
        expect(toOrigin("https://galaxy.example/galaxy/")).toBe("https://galaxy.example");
        expect(toOrigin("http://127.0.0.1:8080/")).toBe("http://127.0.0.1:8080");
    });

    test("a url carrying no origin has none", () => {
        expect(toOrigin("/")).toBeUndefined();
        expect(toOrigin("/galaxy/")).toBeUndefined();
        expect(toOrigin("ROOT")).toBeUndefined();
        expect(toOrigin("")).toBeUndefined();
    });
});
