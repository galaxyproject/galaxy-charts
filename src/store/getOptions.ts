import { GalaxyApi } from "@/api/client";
import { historiesGetContents } from "@/api/histories";
import { optionsFor } from "@/schema/inputOptions";
import type { OptionInputType } from "@/schema/inputOptions";
import { INPUT_TYPES } from "@/schema/inputTypes";
import type { InputOptionType } from "@/types";
import { getCache } from "./getCache";

/** Page size for history dataset options. */
export const HISTORY_LIMIT = 100;

export interface OptionContextType {
    /** Dataset the options are drawn from. */
    datasetId?: string;
    /** Search term; not part of the option set. */
    query?: string;
}

function fetchDataset(datasetId: string) {
    return getCache(`dataset:${datasetId}`, async () => {
        const { data } = await GalaxyApi().GET(`/api/datasets/${datasetId}`);
        return data;
    });
}

function fetchDataTable(table: string) {
    return getCache(`table:${table}`, async () => {
        const { data } = await GalaxyApi().GET(`/api/tool_data/${table}`);
        return { ...data, table };
    });
}

function fetchJsonEntries(url: string) {
    return getCache(`json:${url}`, async () => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to request data json: ${response.status}`);
        }
        return await response.json();
    });
}

/** Skips a table that cannot be read. */
async function fetchDataTables(tables: Array<string>) {
    const payloads = [];
    for (const table of tables) {
        try {
            payloads.push(await fetchDataTable(table));
        } catch (err) {
            console.debug("[charts] Failed to request data table.", err);
        }
    }
    return payloads;
}

/** Fetches and maps the values an input may hold; selects none. */
export async function getOptions(
    input: OptionInputType,
    context: OptionContextType = {},
): Promise<Array<InputOptionType>> {
    switch (INPUT_TYPES[input.type]?.options?.kind) {
        case "data_json":
            return input.url ? optionsFor(input, await fetchJsonEntries(input.url)) : [];
        case "data_table":
            return optionsFor(input, await fetchDataTables(input.tables ?? []));
        case "dataset_column":
            return context.datasetId ? optionsFor(input, await fetchDataset(context.datasetId)) : [];
        case "declared":
        case undefined:
            return optionsFor(input);
        case "history_dataset": {
            if (!context.datasetId) {
                return [];
            }
            const dataset = await fetchDataset(context.datasetId);
            const contents = await historiesGetContents(
                dataset.history_id,
                context.query,
                input.extension,
                HISTORY_LIMIT,
            );
            return optionsFor(input, contents);
        }
    }
}
