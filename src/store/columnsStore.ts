import { ref } from "vue";
import { datasetsGetColumns } from "@/api/datasets";

const SPECIAL_KEYS = ["auto", undefined];

// Define the structure for columns
const columns = ref<Record<string, Record<string, any>>>({});

interface Track {
    [key: string]: string | undefined;
}

export function useColumnsStore() {
    function getColumns(tracks: Track[], keys: string[]): string[] {
        const columnsList: string[] = [];
        for (const track of tracks) {
            for (const key of keys) {
                const column = track[key];
                if (column && ![...columnsList, ...SPECIAL_KEYS].includes(column)) {
                    columnsList.push(column);
                }
            }
        }
        return columnsList;
    }

    async function fetchColumns(datasetId: string, tracks: Track[], keys: string[]): Promise<Record<string, any>[]> {
        columns.value[datasetId] = columns.value[datasetId] || {};
        const columnsAvailable = Object.keys(columns.value[datasetId]);
        const columnsList = getColumns(tracks, keys).filter((x) => !columnsAvailable.includes(x));

        if (columnsList.length > 0) {
            const columnsData = await datasetsGetColumns(datasetId, columnsList);
            if (columnsData) {
                for (const [index, column] of columnsList.entries()) {
                    columns.value[datasetId][column] = columnsData[index];
                }
            }
        }

        const results: Record<string, any>[] = [];
        tracks.forEach((track) => {
            const trackEntry: Record<string, any> = {};
            keys.forEach((key) => {
                const column = track[key];
                if (column && !SPECIAL_KEYS.includes(column)) {
                    trackEntry[key] = columns.value[datasetId][column];
                }
            });
            results.push(trackEntry);
        });

        return results;
    }

    return {
        fetchColumns,
    };
}
