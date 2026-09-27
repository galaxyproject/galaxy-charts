import { historiesGetContents } from "@/api/histories";
import { optionsFor } from "@/schema/inputOptions";
import type { OptionInputType } from "@/schema/inputOptions";
import { INPUT_TYPES } from "@/schema/inputTypes";
import type { InputOptionType, ClientType } from "@/types";
import { getCache } from "./getCache";

/** Page size for history dataset options. */
export const HISTORY_LIMIT = 100;

export interface OptionContextType {
    /** Reaches Galaxy. */
    client: ClientType;
    /** Dataset the options are drawn from. */
    datasetId?: string;
    /** Search term; not part of the option set. */
    query?: string;
}

function fetchDataset(client: ClientType, datasetId: string) {
    return getCache(`dataset:${datasetId}`, () => client.api(`api/datasets/${datasetId}`));
}

function fetchDataTable(client: ClientType, table: string) {
    return getCache(`table:${table}`, async () => {
        const data = (await client.api(`api/tool_data/${table}`)) as Record<string, unknown>;
        return { ...data, table };
    });
}

function fetchJsonEntries(client: ClientType, url: string) {
    return getCache(`json:${url}`, () => client.url(url));
}

/** Skips a table that cannot be read. */
async function fetchDataTables(client: ClientType, tables: Array<string>) {
    const payloads = [];
    for (const table of tables) {
        try {
            payloads.push(await fetchDataTable(client, table));
        } catch (err) {
            console.debug("[charts] Failed to request data table.", err);
        }
    }
    return payloads;
}

/** Fetches and maps the values an input may hold; selects none. */
export async function getOptions(
    input: OptionInputType,
    context: OptionContextType,
): Promise<Array<InputOptionType>> {
    const { client } = context;
    switch (INPUT_TYPES[input.type]?.options?.kind) {
        case "data_json":
            return input.url ? optionsFor(input, await fetchJsonEntries(client, input.url)) : [];
        case "data_table":
            return optionsFor(input, await fetchDataTables(client, input.tables ?? []));
        case "dataset_column":
            return context.datasetId ? optionsFor(input, await fetchDataset(client, context.datasetId)) : [];
        case "declared":
        case undefined:
            return optionsFor(input);
        case "history_dataset": {
            if (!context.datasetId) {
                return [];
            }
            const dataset = (await fetchDataset(client, context.datasetId)) as { history_id?: unknown };
            const historyId = dataset?.history_id;
            if (typeof historyId !== "string" || !historyId) {
                throw new Error(`Dataset ${context.datasetId} reports no history to list datasets from.`);
            }
            const contents = await historiesGetContents(
                client,
                historyId,
                context.query,
                input.extension,
                HISTORY_LIMIT,
            );
            return optionsFor(input, contents);
        }
    }
}
