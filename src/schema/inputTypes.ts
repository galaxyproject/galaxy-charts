/** What each input type stores, so consumers need not infer it from a plugin's XML. */
import { z } from "zod";

/** Stored by `InputData.vue`. */
export const SelectedDataset = z.looseObject({
    id: z.string(),
    extension: z.string().optional(),
    hid: z.number().int().optional(),
    name: z.string().optional(),
});

/** Stored by `dataTableStore.ts`. */
export const SelectedDataTableRow = z.looseObject({
    id: z.string(),
    columns: z.array(z.string()).optional(),
    row: z.array(z.string()).optional(),
    table: z.string().optional(),
});

/** Stored by `dataJsonStore.ts`, the remote entry verbatim. */
export const SelectedJsonEntry = z.looseObject({
    id: z.string(),
    name: z.string().optional(),
});

export interface InputTypeSpec {
    stores: z.ZodType;
    bounds?: string[];
    options?: { kind: string; from?: string; filters?: string[] };
    nests?: "conditional";
    /** Value to store when neither the config nor the plugin's `<value>` supplies one. `requires`
     * names a flag the input must declare for the fallback to apply. Dataset-independent only: a
     * default that needs column metadata cannot be resolved here. */
    fallback?: { value: string; requires?: string };
}

export const INPUT_TYPES: Record<string, InputTypeSpec> = {
    boolean: { stores: z.boolean() },
    color: { stores: z.string() },
    text: { stores: z.string() },
    textarea: { stores: z.string() },
    integer: { stores: z.number().int(), bounds: ["min", "max"] },
    float: { stores: z.number(), bounds: ["min", "max"] },
    select: { stores: z.string(), options: { kind: "declared", from: "data" } },
    // `is_number` and `is_text` filter which columns are offered, not what is stored.
    data_column: {
        stores: z
            .string()
            .regex(/^(auto|\d+)$/)
            .describe(
                'Zero-based column index as a string, or "auto". Never a column name. The form ' +
                    'labels columns from 1, so the column shown as "Column: 5" stores "4".',
            ),
        options: { kind: "dataset_column", filters: ["is_auto", "is_text", "is_number"] },
        fallback: { value: "auto", requires: "is_auto" },
    },
    data: { stores: SelectedDataset, options: { kind: "history_dataset", from: "extension" } },
    data_table: {
        stores: SelectedDataTableRow,
        options: { kind: "data_table", from: "tables" },
    },
    data_json: { stores: SelectedJsonEntry, options: { kind: "data_json", from: "url" } },
    conditional: { stores: z.looseObject({}), nests: "conditional" },
};

/** The value an input stores when nothing supplies one, or undefined. */
export function inputTypeFallback(type: string, declares: (flag: string) => boolean): string | undefined {
    const fallback = INPUT_TYPES[type]?.fallback;
    if (!fallback) {
        return undefined;
    }
    return !fallback.requires || declares(fallback.requires) ? fallback.value : undefined;
}

/** Plain data, for consumers in other languages. */
export function inputTypeRegistry(version: string): Record<string, unknown> {
    const types: Record<string, unknown> = {};
    for (const [name, spec] of Object.entries(INPUT_TYPES)) {
        const { stores, ...rest } = spec;
        types[name] = { stores: z.toJSONSchema(stores), ...rest };
    }
    return { version, types };
}
