import { ref } from "vue";
import { GalaxyApi } from "@/api/client";
import type { InputSelectOptionType, ResponseType } from "@/types";

const dataTableCache = ref<Record<string, ResponseType>>({});

export function useDataTableStore() {
    async function parseDataTable(table: string, tablePromise: ResponseType) {
        const { data: tableData } = await tablePromise;
        const columns = tableData.columns || [];
        const fields = tableData.fields || [];
        const length = columns.length;
        const options: Array<InputSelectOptionType> = [];
        if (length > 0 && fields && fields.length > 0) {
            const nameCol = Math.max(columns.indexOf("name"), 0);
            const valueCol = Math.max(columns.indexOf("value"), 0);
            fields.forEach((row: Array<string>) => {
                const validRow = row.length === length;
                options.push({
                    label: validRow ? row[nameCol] : row[0],
                    value: {
                        id: validRow ? row[valueCol] : row[0],
                        columns,
                        row,
                        table,
                    },
                });
            });
        } else if (length === 0) {
            console.debug(`[charts] No data found in ${table}.`);
        }
        return options;
    }

    async function getDataTable(table: string): Promise<Array<InputSelectOptionType>> {
        if (!dataTableCache.value[table]) {
            dataTableCache.value[table] = GalaxyApi()
                .GET(`/api/tool_data/${table}`)
                .catch((err) => {
                    delete dataTableCache.value[table];
                    throw err;
                });
        }
        return await parseDataTable(table, dataTableCache.value[table]);
    }

    return {
        getDataTable,
    };
}
