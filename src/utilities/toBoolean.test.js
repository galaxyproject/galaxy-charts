import { toBoolean } from "./toBoolean.ts";

test("to boolean conversion", () => {
    expect(toBoolean(true)).toBeTruthy();
    expect(toBoolean("true")).toBeTruthy();
    expect(toBoolean("TrUe")).toBeTruthy();
    expect(toBoolean(false)).toBeFalsy();
    expect(toBoolean("rue")).toBeFalsy();
    expect(toBoolean(1)).toBeFalsy();
    expect(toBoolean(null)).toBeFalsy();
    expect(toBoolean(undefined)).toBeFalsy();
});
