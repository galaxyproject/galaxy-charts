import axios from "axios";
import { rethrowSimple } from "@/utilities/simpleError";

export function getDatasetUrl(root, datasetId) {
    return `${root}api/datasets/${datasetId}/display`;
}

export async function datasetsGet(root, id) {
    const url = `${root}api/datasets/${id}`;
    try {
        const { data } = await axios.get(url);
        return data;
    } catch (err) {
        rethrowSimple(err);
    }
}

export async function datasetsGetColumns(root, datasetId, columnList) {
    const url = `${root}api/datasets/${datasetId}`;
    const params = new URLSearchParams({
        data_type: "raw_data",
        provider: "dataset-column",
        indeces: columnList.toString(),
    }).toString();
    const { data } = await axios.get(`${url}?${params}`);
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
}
