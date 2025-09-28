import { ref } from "vue";
import type { InputSelectOptionType } from "@/types";

type ValueType = { id: string; name?: string };

const dataJsonCache = ref<Record<string, Promise<Array<InputSelectOptionType>>>>({});

export function useDataJsonStore() {
    async function fetchDataJson(url: string): Promise<Array<InputSelectOptionType>> {
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

    async function getDataJson(url: string): Promise<Array<InputSelectOptionType>> {
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
