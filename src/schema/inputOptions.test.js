import { describe, test, expect } from "vitest";
import { optionValue, optionsFor, scalarOptions } from "./inputOptions";
import { INPUT_TYPES } from "./inputTypes";

describe("optionsFor", () => {
    test("a declared select offers exactly what the declaration lists", () => {
        const input = { name: "kind", type: "select", data: [{ label: "Bar", value: "bar" }] };
        expect(optionsFor(input)).toEqual([{ label: "Bar", value: "bar" }]);
    });

    test("a column offers the indices its filters allow, labelled from one", () => {
        const dataset = { metadata_column_types: { 0: "str", 1: "int", 2: "float" } };
        const numeric = optionsFor({ name: "y", type: "data_column", is_number: "true" }, dataset);
        expect(numeric).toEqual([
            { label: "Column: 2", value: "1" },
            { label: "Column: 3", value: "2" },
        ]);
        const text = optionsFor({ name: "label", type: "data_column", is_text: "true" }, dataset);
        expect(text).toEqual([{ label: "Column: 1", value: "0" }]);
    });

    test("an auto column offers the sentinel first", () => {
        const dataset = { metadata_column_types: { 0: "int" } };
        const options = optionsFor({ name: "x", type: "data_column", is_auto: "true" }, dataset);
        expect(options[0]).toEqual({ label: "Column: Default", value: "auto" });
    });

    test("history contents offer the object a data input stores", () => {
        const contents = [{ id: "a1", extension: "bed", hid: 3, name: "peaks" }];
        expect(optionsFor({ name: "ds", type: "data" }, contents)).toEqual([
            { label: "3: peaks", value: { id: "a1", extension: "bed", hid: 3, name: "peaks" } },
        ]);
    });

    test("a data table names its value and label columns", () => {
        const payload = [{ table: "t", columns: ["name", "value"], fields: [["hg38", "hg38.fa"]] }];
        expect(optionsFor({ name: "row", type: "data_table" }, payload)).toEqual([
            {
                label: "hg38",
                value: { id: "hg38.fa", columns: ["name", "value"], row: ["hg38", "hg38.fa"], table: "t" },
            },
        ]);
    });

    test("a row of the wrong width falls back to its first field", () => {
        const payload = [{ table: "t", columns: ["name", "value"], fields: [["only"]] }];
        expect(optionsFor({ name: "row", type: "data_table" }, payload)[0]).toMatchObject({
            label: "only",
            value: { id: "only" },
        });
    });

    test("tables merge with the first occurrence of an id winning", () => {
        const payload = [
            { table: "first", columns: ["name", "value"], fields: [["a", "shared"]] },
            { table: "second", columns: ["name", "value"], fields: [["b", "shared"], ["c", "own"]] },
        ];
        const options = optionsFor({ name: "row", type: "data_table" }, payload);
        expect(options.map((option) => option.label)).toEqual(["a", "c"]);
        expect(options.map((option) => option.value.id)).toEqual(["shared", "own"]);
        expect(options[0].value.table).toBe("first");
    });

    test("json entries are offered verbatim", () => {
        const entries = [{ id: "hg19", name: "Human hg19", fastaURL: "http://x/hg19.fa" }];
        expect(optionsFor({ name: "g", type: "data_json" }, entries)).toEqual([
            { label: "Human hg19", value: { id: "hg19", name: "Human hg19", fastaURL: "http://x/hg19.fa" } },
        ]);
    });

    test("an entry with no name is labelled by its id", () => {
        expect(optionsFor({ name: "g", type: "data_json" }, [{ id: "hg19" }])[0].label).toBe("hg19");
    });

    test("every kind the registry declares is handled", () => {
        const kinds = Object.values(INPUT_TYPES)
            .map((spec) => spec.options?.kind)
            .filter(Boolean);
        expect(new Set(kinds)).toEqual(
            new Set(["declared", "dataset_column", "history_dataset", "data_table", "data_json"]),
        );
        const withOptions = Object.keys(INPUT_TYPES).filter((type) => INPUT_TYPES[type].options);
        expect(withOptions.map((type) => Array.isArray(optionsFor({ type })))).toEqual(
            withOptions.map(() => true),
        );
    });

    test("a type with no options offers none", () => {
        expect(optionsFor({ name: "n", type: "integer" }, { anything: true })).toEqual([]);
    });

    test("a missing payload offers none rather than throwing", () => {
        for (const type of ["data_column", "data", "data_table", "data_json"]) {
            expect(optionsFor({ name: "x", type })).toEqual([]);
        }
    });
});

describe("population and selection stay separate", () => {
    test("optionsFor reports what is available and chooses nothing", () => {
        const dataset = { metadata_column_types: { 0: "int", 1: "int" } };
        const input = { name: "y", type: "data_column", is_number: "true" };
        const options = optionsFor(input, dataset);
        expect(options.length).toBe(2);
        expect(options.every((option) => Object.keys(option).sort().join() === "label,value")).toBe(true);
        expect(optionsFor(input, dataset)).toEqual(options);
    });

    test("every offered value is one the input type says it may store", () => {
        const dataset = { metadata_column_types: { 0: "str", 1: "int" } };
        for (const option of optionsFor({ name: "x", type: "data_column", is_auto: "true" }, dataset)) {
            expect(INPUT_TYPES.data_column.stores.safeParse(option.value).success).toBe(true);
        }
        const payload = [{ table: "t", columns: ["name", "value"], fields: [["hg38", "hg38.fa"]] }];
        for (const option of optionsFor({ name: "row", type: "data_table" }, payload)) {
            expect(INPUT_TYPES.data_table.stores.safeParse(option.value).success).toBe(true);
        }
    });
});

describe("helpers", () => {
    test("scalarOptions keeps only options a select can bind to directly", () => {
        const mixed = [
            { label: "a", value: "0" },
            { label: "b", value: { id: "x" } },
            { label: "c", value: null },
        ];
        expect(scalarOptions(mixed)).toEqual([{ label: "a", value: "0" }]);
    });


    test("optionValue reads the object an option holds and ignores string values", () => {
        expect(optionValue({ label: "a", value: { id: "x", row: ["hg38"] } })).toEqual({ id: "x", row: ["hg38"] });
        expect(optionValue({ label: "b", value: "0" })).toBeUndefined();
        expect(optionValue({ label: "c", value: null })).toBeUndefined();
    });
});
