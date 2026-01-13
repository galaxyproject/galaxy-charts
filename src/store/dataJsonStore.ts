import { ref } from "vue";
import type { InputOptionType } from "@/types";

/** JSON data entry - has required id and optional extra fields */
type ValueType = {
    id: string;
    name?: string;
    [key: string]: unknown;
};

const dataJsonCache = ref<Record<string, Promise<Array<InputOptionType>>>>({});

export function useDataJsonStore() {
    async function fetchDataJson(url: string): Promise<Array<InputOptionType>> {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error("[charts] Failed to request data json.", response.status);
                return [];
            }
            const result: ValueType[] = await response.json();
            return result.map((entry) => ({
                label: entry.name || entry.id,
                value: { ...entry },
            }));
        } catch (err) {
            console.debug("[charts] Failed to request data json.", err);
            return [];
        }
    }

    async function getDataJson(url: string): Promise<Array<InputOptionType>> {
        if (!dataJsonCache.value[url]) {
            dataJsonCache.value[url] = fetchDataJson(url);
        }
        return await dataJsonCache.value[url];
    }

    function resetDataJson() {
        dataJsonCache.value = {};
    }

    return { getDataJson, resetDataJson };
}
