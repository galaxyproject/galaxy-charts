import { describe, expect, test } from "vitest";
import Ajv2020 from "ajv/dist/2020";
import { parametersSchema } from "./parametersSchema";
import { validateValues } from "./validateValues";
import { parseValues } from "@/utilities/parsePlugin";

const settings = [
    { name: "title", type: "text", label: "Title", help: "Shown above the chart.", value: "Chart" },
    { name: "count", type: "integer", min: "1", max: "10", value: "3" },
    { name: "ratio", type: "float", min: "0" },
    { name: "flag", type: "boolean" },
    {
        name: "shape",
        type: "select",
        value: "circle",
        data: [
            { label: "Circle", value: "circle" },
            { label: "Square", value: "square" },
        ],
    },
    { name: "column", type: "data_column", help: "The values.", is_auto: "true", is_number: "true" },
    { name: "dataset", type: "data", extension: "bed, bigwig" },
    {
        name: "mode",
        type: "conditional",
        test_param: {
            name: "kind",
            label: "Kind",
            help: "How much to configure.",
            type: "select",
            value: "simple",
            data: [
                { label: "Simple", value: "simple" },
                { label: "Advanced", value: "advanced" },
            ],
        },
        cases: [
            { value: "simple", inputs: [] },
            { value: "advanced", inputs: [{ name: "depth", type: "integer", min: "0" }] },
        ],
    },
];

const tracks = [
    { name: "color", type: "color" },
    { name: "notes", type: "textarea" },
];

const schema = parametersSchema({ name: "example", html: "Example", settings, tracks });
const validate = new Ajv2020({ strict: false }).compile(schema);
const valid = (values) => validate(values);

describe("parametersSchema", () => {
    test("is an object per level, like a tool's request schema", () => {
        expect(schema.$schema).toBe("https://json-schema.org/draft/2020-12/schema");
        expect(schema.title).toBe("Example");
        expect(schema.additionalProperties).toBe(false);
        expect(schema.properties.settings.additionalProperties).toBe(false);
        expect(schema.properties.tracks.items.additionalProperties).toBe(false);
    });

    test("describes each input with its type, label, help, bounds and default", () => {
        const { title, count, flag, column } = schema.properties.settings.properties;
        expect(title).toMatchObject({ type: "string", gx_type: "gx_text", title: "Title", default: "Chart" });
        expect(title.description).toBe("Shown above the chart.");
        expect(count).toMatchObject({ type: "integer", minimum: 1, maximum: 10, default: 3 });
        expect(schema.properties.settings.properties.mode.oneOf[1].properties.depth).toEqual({
            type: "integer",
            minimum: 0,
            gx_type: "gx_integer",
        });
        expect(flag).toMatchObject({ type: "boolean", default: false });
        expect(column).toMatchObject({ pattern: "^(auto|\\d+)$", default: "auto" });
        expect(column.description).toMatch(/^The values\. Zero-based column index/);
    });

    test("names a textarea as tools do, a text parameter with an area", () => {
        expect(schema.properties.tracks.items.properties.notes).toEqual({
            type: "string",
            gx_type: "gx_text",
            gx_area: true,
        });
    });

    test("prefers a conditional's own label and help over its test parameter's", () => {
        const own = parametersSchema({
            name: "own",
            settings: [{ ...settings.at(-1), label: "Mode", help: "The mode." }],
        }).properties.settings.properties.mode;
        expect(own).toMatchObject({ title: "Mode", description: "The mode." });
    });

    test("lists declared choices as oneOf with titles", () => {
        expect(schema.properties.settings.properties.shape.oneOf).toEqual([
            { const: "circle", title: "Circle" },
            { const: "square", title: "Square" },
        ]);
    });

    test("names where runtime choices come from", () => {
        const { column, dataset } = schema.properties.settings.properties;
        expect(column.gx_source).toEqual({ kind: "dataset_column", is_auto: true, is_number: true });
        expect(dataset.gx_source).toEqual({ kind: "history_dataset" });
        expect(dataset.gx_extensions).toEqual(["bed", "bigwig"]);
    });

    test("gives a conditional one branch per case, and one for an absent test value", () => {
        const { mode } = schema.properties.settings.properties;
        expect(mode).toMatchObject({ gx_type: "gx_conditional", title: "Kind", description: "How much to configure." });
        expect(mode.oneOf.map((branch) => branch.properties.kind)).toEqual([
            { const: "simple", title: "Simple" },
            { const: "advanced", title: "Advanced" },
            undefined,
        ]);
        expect(mode.default).toEqual({ kind: "simple" });
        expect(valid({ settings: { mode: { kind: "advanced", depth: 2 } } })).toBe(true);
        expect(valid({ settings: { mode: { kind: "simple", depth: 2 } } })).toBe(false);
        expect(valid({ settings: { mode: { kind: "other" } } })).toBe(false);
        expect(valid({ settings: { mode: {} } })).toBe(true);
        expect(valid({ settings: { mode: { depth: 2 } } })).toBe(false);
    });

    test("keeps a repeated case or a case input named like the test parameter from overlapping", () => {
        const clash = [
            {
                name: "mode",
                type: "conditional",
                test_param: { name: "kind", type: "select", value: "a" },
                cases: [
                    { value: "a", inputs: [{ name: "kind", type: "text" }] },
                    { value: "b", inputs: [] },
                    { value: "b", inputs: [{ name: "extra", type: "text" }] },
                ],
            },
        ];
        const check = new Ajv2020({ strict: false }).compile(parametersSchema({ name: "clash", settings: clash }));
        for (const mode of [{}, { kind: "a" }, { kind: "b" }]) {
            expect(check({ settings: { mode } })).toBe(true);
            expect(validateValues(clash, { mode })).toEqual([]);
        }
        expect(check({ settings: { mode: { kind: "c" } } })).toBe(false);
    });

    test("accepts what parseValues resolves from an empty config", () => {
        const values = JSON.parse(JSON.stringify(parseValues(settings, {})));
        expect(valid({ settings: values })).toBe(true);
    });

    test("agrees with validateValues", () => {
        const samples = [
            { title: "x", count: 5, shape: "square", column: "2" },
            { count: 0 },
            { count: 11 },
            { count: 2.5 },
            { ratio: -1 },
            { shape: "triangle" },
            { column: "Buried" },
            { dataset: { id: "abc", extension: "bed" } },
            { dataset: "abc" },
            { unknown: 1 },
            { mode: { kind: "advanced", depth: -1 } },
            { mode: { kind: "advanced", depth: 1 } },
            { mode: { kind: "other" } },
            { mode: {} },
            { mode: { depth: 2 } },
        ];
        const agreement = samples.map((values) => [
            valid({ settings: values }),
            validateValues(settings, values).length === 0,
        ]);
        expect(agreement.filter(([schema, issues]) => schema !== issues)).toEqual([]);
    });

    test("types tracks as a list", () => {
        expect(valid({ tracks: [{ color: "#ff0000" }, {}] })).toBe(true);
        expect(valid({ tracks: [{ colour: "#ff0000" }] })).toBe(false);
        expect(valid({ other: [] })).toBe(false);
    });

    test("refuses an input type it does not know", () => {
        expect(() => parametersSchema({ settings: [{ name: "x", type: "setting_type" }] })).toThrow(
            "Unknown input type 'setting_type'.",
        );
    });
});
