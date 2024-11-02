import { fetchApi } from "@/api/client";

export async function datasetsGetColumns(datasetId, columnList) {
    try {
        const url = `/api/datasets/${datasetId}`;
        const params = new URLSearchParams({
            data_type: "raw_data",
            provider: "dataset-column",
            indeces: columnList.toString(),
        }).toString();
        const data = await fetchApi(`${url}?${params}`);
        const columnLength = columnList.length;
        const results = new Array(columnLength);
        for (let i = 0; i < results.length; i++) {
            results[i] = [];
        }
        for (const row of data.data) {
            for (const j in row) {
                const v = row[j];
                if (v !== undefined && v != 2147483647 && j < columnLength) {
                    results[j].push(v);
                }
            }
        }
        return results;
    } catch (err) {
        console.error(err);
    }
}

export function datasetsGetUrl(datasetId) {
    return `/api/datasets/${datasetId}/display`;
}
