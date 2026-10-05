/** What each input type stores, so consumers need not infer it from a plugin's XML. */
import type { InputAtomicType, InputValueType } from "../types";
import { z } from "zod";
// Relative: vite.config.js imports this module outside vite's alias resolution.
import { toBoolean } from "../utilities/toBoolean";

export type CoercionType = "number" | "boolean";

/** A selected history dataset. */
export const SelectedDataset = z.looseObject({
    id: z.string().min(1),
    extension: z.string().optional(),
    hid: z.number().int().optional(),
    name: z.string().optional(),
});

/** A selected tool data table row. */
export const SelectedDataTableRow = z.looseObject({
    id: z.string().min(1),
    columns: z.array(z.string()).optional(),
    row: z.array(z.string()).optional(),
    table: z.string().optional(),
});

/** A selected remote json entry. */
export const SelectedJsonEntry = z.looseObject({
    id: z.string().min(1),
    name: z.string().optional(),
});

/** Where an input's options come from. */
export type OptionKindType = "data_json" | "data_table" | "dataset_column" | "declared" | "history_dataset";

export interface InputTypeSpec {
    stores: z.ZodType;
    bounds?: string[];
    options?: { kind: OptionKindType; from?: string; filters?: string[] };
    nests?: "conditional";
    /** Applied once a value resolves, never before. */
    coerce?: CoercionType;
    /** Value to store when neither the config nor the plugin's `<value>` supplies one. `requires`
     * names a flag the input must declare for the fallback to apply. Dataset-independent only: a
     * default that needs column metadata cannot be resolved here. */
    fallback?: { value: string; requires?: string };
}

export const INPUT_TYPES: Record<string, InputTypeSpec> = {
    // An unset switch is off, so the form and a plugin read the same value without a <value>.
    boolean: { stores: z.boolean(), coerce: "boolean", fallback: { value: "false" } },
    color: { stores: z.string() },
    text: { stores: z.string() },
    textarea: { stores: z.string() },
    integer: { stores: z.number().int(), bounds: ["min", "max"], coerce: "number" },
    float: { stores: z.number(), bounds: ["min", "max"], coerce: "number" },
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
    // Persisted, with no form control.
    hidden: { stores: z.string() },
};

/** The value an input stores when nothing supplies one, or undefined. */
export function inputTypeFallback(type: string, declares: (flag: string) => boolean): string | undefined {
    const fallback = INPUT_TYPES[type]?.fallback;
    if (!fallback) {
        return undefined;
    }
    return !fallback.requires || declares(fallback.requires) ? fallback.value : undefined;
}

/** A number, or undefined for a value that states none: "" and "abc" resolve to nothing, not 0 or NaN. */
function numberOf(value: InputValueType): number | undefined {
    const parsed = typeof value === "number" ? value : String(value).trim() === "" ? NaN : Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
}

/** The resolved value as its type stores it. Nothing resolved is left unset rather than coerced. */
export function coerceInputValue(type: string, value: InputValueType): InputValueType {
    if (value === undefined || value === null) {
        return undefined;
    }
    switch (INPUT_TYPES[type]?.coerce) {
        case "number":
            return numberOf(value);
        case "boolean":
            // Only scalar types declare a coercion, so a coerced value is never the object arm.
            return toBoolean(value as InputAtomicType);
        default:
            return value;
    }
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
