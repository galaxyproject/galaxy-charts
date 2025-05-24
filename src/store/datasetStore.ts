import { ref } from "vue";
import { GalaxyApi } from "@/api/client";

type Dataset = Record<string, any>;

const datasetCache = ref<Record<string, Promise<Dataset>>>({});

export function useDatasetStore() {
    async function getDataset(datasetId: string): Promise<Dataset> {
        if (!datasetCache.value[datasetId]) {
            datasetCache.value[datasetId] = GalaxyApi()
                .GET(`/api/datasets/${datasetId}`)
                .catch((err) => {
                    delete datasetCache.value[datasetId];
                    throw err;
                });
        }
        return await datasetCache.value[datasetId];
    }

    return {
        getDataset,
    };
}
