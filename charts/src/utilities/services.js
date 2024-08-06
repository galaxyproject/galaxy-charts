import axios from "axios";
import { rethrowSimple } from "./simpleError";
export async function create(root, type, payload) {
    try {
        const response = await axios.post(`${root}api/visualizations`, { type, ...payload });
        return response.data;
    } catch (err) {
        rethrowSimple(err);
    }
}

export function save(visualizationId, payload) {
    alert(payload);
}
