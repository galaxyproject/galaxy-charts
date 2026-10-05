import { describe, expect, test } from "vitest";
import { validateValues } from "./validateValues";
import { parseValues } from "@/utilities/parsePlugin";

const inputs = [
    { name: "title", type: "text" },
    { name: "count", type: "integer", min: "1", max: "10" },
    { name: "ratio", type: "float", min: "0" },
    {
        name: "shape",
        type: "select",
        data: [
            { label: "Circle", value: "circle" },
            { label: "Square", value: "square" },
        ],
    },
    { name: "column", type: "data_column" },
    { name: "dataset", type: "data" },
    {
        name: "mode",
        type: "conditional",
        test_param: { name: "kind", type: "select", value: "simple" },
        cases: [
            { value: "simple", inputs: [] },
            { value: "advanced", inputs: [{ name: "depth", type: "integer", min: "0" }] },
        ],
    },
];

const codes = (values) => validateValues(inputs, values).map((issue) => [issue.code, issue.path]);

describe("a config within the declared input contract", () => {
    test("a config in the stored form, using only declared values, has no issues", () => {
        const values = {
            title: "t",
            count: 3,
            ratio: 0.5,
            shape: "square",
            column: "2",
            dataset: { id: "d1", name: "reads" },
            mode: { kind: "advanced", depth: 4 },
        };
        expect(validateValues(inputs, values)).toEqual([]);
    });

    test("what the parser fills in from the plugin's defaults conforms", () => {
        expect(validateValues(inputs, parseValues(inputs, { count: 2 }))).toEqual([]);
    });

    test("a value left unset is not a departure", () => {
        expect(validateValues(inputs, { count: null, title: undefined })).toEqual([]);
    });
});

describe("departures from the contract, each with a code and the path it is at", () => {
    test("a level that is not an object", () => {
        expect(validateValues(inputs, ["x"])).toEqual([
            expect.objectContaining({ code: "not_object", path: "", declared: expect.arrayContaining(["count"]) }),
        ]);
    });

    test("an undeclared name, including one placed beside its conditional instead of inside it", () => {
        expect(codes({ extra: 1, depth: 2 })).toEqual([
            ["undeclared", "depth"],
            ["undeclared", "extra"],
        ]);
    });

    test("a value of the wrong shape, against the schema the type publishes", () => {
        const [issue] = validateValues(inputs, { count: "5" });
        expect(issue).toMatchObject({ code: "wrong_shape", path: "count", name: "count" });
        expect(issue.stores).toMatchObject({ type: "integer" });
        expect(codes({ column: "Height" })).toEqual([["wrong_shape", "column"]]);
        expect(codes({ dataset: "d1" })).toEqual([["wrong_shape", "dataset"]]);
    });

    // Stricter than the form on load: it offers only declared values, but shows a stored one it
    // does not declare unchanged. The contract is the declaration, not what survives the form.
    test("a select value the plugin does not declare", () => {
        expect(validateValues(inputs, { shape: "triangle" })).toEqual([
            { code: "not_offered", path: "shape", name: "shape", offered: ["circle", "square"] },
        ]);
    });

    // Likewise: the form clamps a number a user types, but keeps a stored one outside the bounds.
    test("a number outside the declared bounds", () => {
        expect(codes({ count: 0, ratio: -1 })).toEqual([
            ["out_of_bounds", "count"],
            ["out_of_bounds", "ratio"],
        ]);
        expect(codes({ count: 10 })).toEqual([]);
    });

    test("a conditional whose test value selects no case", () => {
        expect(validateValues(inputs, { mode: { kind: "expert" } })).toEqual([
            { code: "no_case", path: "mode.kind", test: "kind", cases: ["simple", "advanced"] },
        ]);
    });

    test("the test parameter is declared in its conditional's object, whichever case it selects", () => {
        expect(validateValues(inputs, { mode: { kind: "simple" } })).toEqual([]);
        expect(validateValues(inputs, { mode: { kind: "simple", other: 1 } })).toEqual([
            { code: "undeclared", path: "mode.other", name: "other", declared: ["kind"] },
        ]);
        expect(validateValues(inputs, { mode: { kind: "advanced", other: 1 } })).toEqual([
            { code: "undeclared", path: "mode.other", name: "other", declared: ["depth", "kind"] },
        ]);
    });

    test("inside the selected case, its own inputs and nothing else", () => {
        expect(codes({ mode: { kind: "advanced", depth: -1 } })).toEqual([["out_of_bounds", "mode.depth"]]);
        expect(codes({ mode: { kind: "simple", depth: 1 } })).toEqual([["undeclared", "mode.depth"]]);
    });

    test("the test parameter's default selects the case when the config omits it", () => {
        expect(codes({ mode: {} })).toEqual([]);
    });
});
