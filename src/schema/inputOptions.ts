/** Maps fetched Galaxy data to the values an input may hold. */
import type { InputElementType, InputOptionType, InputValuesType } from "@/types";
import { INPUT_TYPES } from "./inputTypes";
import { parseColumns } from "@/utilities/parseColumns";
import { toBoolean } from "@/utilities/toBoolean";

/** Declaration fields that determine an input's options. */
export type OptionInputType = Pick<InputElementType, "type"> &
    Partial<Pick<InputElementType, "data" | "extension" | "is_auto" | "is_number" | "is_text" | "tables" | "url">>;

/** Payload for `dataset_column`. */
export interface DatasetPayloadType {
    metadata_column_types?: Record<string, string>;
}

/** Payload for `history_dataset`. */
export interface HistoryDatasetPayloadType {
    extension?: string;
    hid?: number | string;
    id: string;
    name?: string;
}

/** Payload for `data_table`. */
export interface DataTablePayloadType {
    columns?: Array<string>;
    fields?: Array<Array<string>>;
    table: string;
}

function datasetColumnOptions(input: OptionInputType, dataset: Required<DatasetPayloadType>): Array<InputOptionType> {
    return parseColumns(dataset, toBoolean(input.is_auto), toBoolean(input.is_text), toBoolean(input.is_number));
}

function historyDatasetOptions(contents: Array<HistoryDatasetPayloadType>): Array<InputOptionType> {
    return contents.map((item) => ({
        label: `${item.hid}: ${item.name}`,
        value: { id: item.id, extension: item.extension, hid: item.hid, name: item.name },
    }));
}

/** Rows keyed by the table's value column, labelled by its name column. */
function oneTableEntries({ columns = [], fields = [], table }: DataTablePayloadType): Array<[string, InputOptionType]> {
    if (columns.length === 0 || fields.length === 0) {
        return [];
    }
    const nameCol = Math.max(columns.indexOf("name"), 0);
    const valueCol = Math.max(columns.indexOf("value"), 0);
    const unique = new Map<string, InputOptionType>();
    for (const row of fields) {
        const validRow = row.length === columns.length;
        const id = validRow ? row[valueCol] : row[0];
        if (id && !unique.has(id)) {
            unique.set(id, { label: validRow ? row[nameCol] : row[0], value: { id, columns, row, table } });
        }
    }
    return [...unique.entries()].sort(([a], [b]) => a.localeCompare(b));
}

/** Options from several sources, keeping the first of each id. */
function mergeUniqueOptions(lists: Array<Array<InputOptionType>>): Array<InputOptionType> {
    const seen = new Map<string, InputOptionType>();
    for (const list of lists) {
        for (const option of list) {
            const id = option.value && typeof option.value === "object" ? option.value.id : option.value;
            if (id && !seen.has(String(id))) {
                seen.set(String(id), option);
            }
        }
    }
    return [...seen.values()];
}

function dataTableOptions(tables: Array<DataTablePayloadType>): Array<InputOptionType> {
    return mergeUniqueOptions(tables.map((payload) => oneTableEntries(payload).map(([, option]) => option)));
}

function dataJsonOptions(payload: unknown): Array<InputOptionType> {
    const entries: Array<unknown> = Array.isArray(payload) ? payload : [];
    return entries.flatMap((entry) => {
        if (entry === null || typeof entry !== "object" || !("id" in entry) || typeof entry.id !== "string") {
            return [];
        }
        const name = "name" in entry && typeof entry.name === "string" ? entry.name : "";
        return entry.id ? [{ label: name || entry.id, value: { ...entry } }] : [];
    });
}

/** The values an input may hold, from the payload its kind draws on. */
export function optionsFor(input: OptionInputType, payload?: unknown): Array<InputOptionType> {
    switch (INPUT_TYPES[input.type]?.options?.kind) {
        case "data_json":
            return dataJsonOptions(payload);
        case "data_table":
            return dataTableOptions((payload ?? []) as Array<DataTablePayloadType>);
        case "dataset_column":
            return payload ? datasetColumnOptions(input, payload as Required<DatasetPayloadType>) : [];
        case "declared":
            return input.data ?? [];
        case "history_dataset":
            return historyDatasetOptions((payload ?? []) as Array<HistoryDatasetPayloadType>);
        case undefined:
            return [];
    }
}

/** An option's object value, or undefined when it holds a string. */
export function optionValue(option: InputOptionType): InputValuesType | undefined {
    return option.value && typeof option.value === "object" ? option.value : undefined;
}

/** Options whose value is a string. */
export function scalarOptions(options: Array<InputOptionType>): Array<{ label: string; value: string }> {
    return options.flatMap((option) =>
        typeof option.value === "string" ? [{ label: option.label, value: option.value }] : [],
    );
}
