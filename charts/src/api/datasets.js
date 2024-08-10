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
