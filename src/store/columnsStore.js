import { ref } from "vue";
import { datasetsGetColumns } from "@/api/datasets";

const SPECIAL_KEYS = ["auto", undefined];

const columns = ref({});

export function useColumnsStore() {
    function getColumns(tracks, keys) {
        const columnsList = [];
        for (const track of tracks) {
            for (const key of keys) {
                const column = track[key];
                if (![...columnsList, ...SPECIAL_KEYS].includes(column)) {
                    columnsList.push(column);
                }
            }
        }
        return columnsList;
    }

    async function fetchColumns(datasetId, tracks, keys) {
        columns.value[datasetId] = columns.value[datasetId] || {};
        const columnsAvailable = Object.keys(columns.value[datasetId]);
        const columnsList = getColumns(tracks, keys).filter((x) => !columnsAvailable.includes(x));
        if (columnsList.length > 0) {
            const columnsData = await datasetsGetColumns(datasetId, columnsList);
            for (const [index, column] of columnsList.entries()) {
                columns.value[datasetId][column] = columnsData[index];
            }
        }
        const results = [];
        tracks.forEach((track) => {
            const trackEntry = {};
            keys.forEach((key) => {
                const column = track[key];
                if (!SPECIAL_KEYS.includes(column)) {
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
