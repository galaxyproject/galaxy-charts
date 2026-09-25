import { describe, test, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";

import { INPUT_TYPES, inputTypeRegistry, SelectedDataset } from "@/schema/inputTypes";
import InputData from "@/components/inputs/InputData.vue";
import { parseColumns } from "@/utilities/parseColumns";

vi.mock("@/api/client", () => ({
    GalaxyApi: () => ({
        GET: vi.fn().mockResolvedValue({
            // Galaxy returns hid as an integer.
            data: [{ id: "1", hid: 1, name: "d.csv", extension: "csv" }],
        }),
    }),
}));

const keysOf = (schema) => Object.keys(schema.shape ?? {});

describe("the published registry matches what the inputs actually write", () => {
    test("a chosen dataset is stored as the object InputData emits", async () => {
        const wrapper = mount(InputData, {
            props: { datasetId: "123", optional: false, value: null },
        });
        await flushPromises();

        const stored = wrapper.vm.currentOptions[0].value;

        expect(typeof stored).toBe("object");
        expect(keysOf(INPUT_TYPES.data.stores).sort()).toEqual(Object.keys(stored).sort());
        expect(SelectedDataset.safeParse(stored).success).toBe(true);
        expect(SelectedDataset.safeParse("just-an-id").success).toBe(false);
    });

    test("a column is stored as a string, including the auto sentinel", () => {
        const dataset = { metadata_column_types: { 0: "int", 1: "str" } };
        for (const column of parseColumns(dataset, true, false, false)) {
            expect(typeof column.value).toBe("string");
        }
        expect(INPUT_TYPES.data_column.stores.safeParse("0").success).toBe(true);
        expect(INPUT_TYPES.data_column.stores.safeParse(0).success).toBe(false);
        for (const column of parseColumns(dataset, false, false, true)) {
            expect(typeof column.value).toBe("string");
        }
    });

    test("a column name is not a column value", () => {
        expect(INPUT_TYPES.data_column.stores.safeParse("Buried").success).toBe(false);
        expect(INPUT_TYPES.data_column.stores.safeParse("auto").success).toBe(true);
        expect(INPUT_TYPES.data_column.stores.safeParse("").success).toBe(false);
    });

    test("every value the form can produce satisfies the schema it publishes", () => {
        const dataset = { metadata_column_types: { 0: "int", 1: "str", 2: "float" } };
        for (const auto of [true, false]) {
            for (const [isText, isNumber] of [
                [false, false],
                [true, false],
                [false, true],
            ]) {
                for (const column of parseColumns(dataset, auto, isText, isNumber)) {
                    expect(INPUT_TYPES.data_column.stores.safeParse(column.value).success).toBe(true);
                }
            }
        }
    });

    test("the published contract says what a column value is, not merely that it is a string", () => {
        const schema = inputTypeRegistry("test").types.data_column.stores;
        expect(schema.pattern).toBe("^(auto|\\d+)$");
        expect(schema.description).toMatch(/zero-based/i);
        expect(schema.description).toMatch(/never a column name/i);
    });
});

describe("the registry is complete and consumable", () => {
    test("every input type the form renders is declared", async () => {
        const form = await import("@/components/inputs/InputForm.vue?raw");
        const rendered = [...form.default.matchAll(/input\.type === '([a-z_]+)'/g)].map((m) => m[1]);
        const listed = [...form.default.matchAll(/\['([a-z_, ']+)'\]\.includes\(input\.type\)/g)].flatMap((m) =>
            m[1].split(/',\s*'/),
        );
        for (const type of new Set([...rendered, ...listed])) {
            expect(INPUT_TYPES, `input type '${type}' is rendered but not declared`).toHaveProperty(type);
        }
    });

    test("it serialises to plain data for a consumer in another language", () => {
        const registry = inputTypeRegistry("0.0.0-test");
        expect(JSON.parse(JSON.stringify(registry))).toEqual(registry);
        expect(registry.version).toBe("0.0.0-test");
        expect(registry.types.data.stores.required).toEqual(["id"]);
        expect(registry.types.data.stores.type).toBe("object");
    });

    test("a chosen dataset keeps fields a newer galaxy-charts may add", () => {
        expect(SelectedDataset.safeParse({ id: "1", somethingNew: true }).success).toBe(true);
        expect(inputTypeRegistry("x").types.data.stores.additionalProperties).toEqual({});
    });
});
