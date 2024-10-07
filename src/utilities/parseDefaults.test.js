import { parseDefaults } from "./parseDefaults.js";

test("parse defaults", () => {
    expect(
        parseDefaults([
            { name: "a", value: "b" },
            { name: "c", value: "d" },
            { name: "e", value: undefined },
            { name: "f" },
            { value: "g" },
        ]),
    ).toEqual({ a: "b", c: "d", "e": null, "f": null });
});
