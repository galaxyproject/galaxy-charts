import { ref } from "vue";
import type { InputSelectOptionType } from "@/types";

type ValueType = {
    id: string;
    name?: string;
};

const dataJsonCache = ref<Record<string, Promise<Response>>>({});

export function useDataJsonStore() {
    async function parseDataJson(url: string, promise: Promise<Response>): Promise<Array<InputSelectOptionType>> {
        try {
            const response = await promise;
            if (response.ok) {
                const result: ValueType[] = await response.json();
                return result.map((entry: ValueType) => ({
                    label: entry.name || entry.id,
                    value: { ...entry },
                }));
            } else {
                console.error("[charts] Failed to request data json.", response.status);
                delete dataJsonCache.value[url];
                return [];
            }
        } catch (err) {
            console.debug("[charts] Failed to request data json.", err);
            delete dataJsonCache.value[url];
            return [];
        }
    }

    async function getDataJson(url: string): Promise<Array<InputSelectOptionType>> {
        if (!dataJsonCache.value[url]) {
            dataJsonCache.value[url] = fetch(url);
        }
        return await parseDataJson(url, dataJsonCache.value[url]);
    }

    function resetDataJson() {
        dataJsonCache.value = {};
    }

    return {
        getDataJson,
        resetDataJson,
    };
}
