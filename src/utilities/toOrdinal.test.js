import { toOrdinal } from "./toOrdinal.ts";

test("to ordinal string conversion", () => {
    expect(toOrdinal(1)).toBe("1st");
    expect(toOrdinal(2)).toBe("2nd");
    expect(toOrdinal(3)).toBe("3rd");
    expect(toOrdinal(4)).toBe("4th");
    expect(toOrdinal(15)).toBe("15th");
});
