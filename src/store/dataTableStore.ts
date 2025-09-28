import { ref } from "vue";
import { GalaxyApi } from "@/api/client";
import type { InputSelectOptionType, ResponseType } from "@/types";

const dataTableCache = ref<Record<string, ResponseType>>({});

export function useDataTableStore() {
    async function parseDataTable(table: string, promise: ResponseType) {
        const { data } = await promise;
        const columns = data.columns || [];
        const fields = data.fields || [];
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

    async function getDataTable(name: string): Promise<Array<InputSelectOptionType>> {
        if (!dataTableCache.value[name]) {
            dataTableCache.value[name] = GalaxyApi()
                .GET(`/api/tool_data/${name}`)
                .catch((err) => {
                    delete dataTableCache.value[name];
                    throw err;
                });
        }
        return await parseDataTable(name, dataTableCache.value[name]);
    }

    return {
        getDataTable,
    };
}
