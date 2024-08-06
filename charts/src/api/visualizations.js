import axios from "axios";
import { rethrowSimple } from "@/utilities/simpleError";
export async function visualizationsCreate(root, type, title, config) {
    try {
        const { data } = await axios.post(`${root}api/visualizations`, {
            type,
            title,
            config,
        });
        return data.id;
    } catch (err) {
        rethrowSimple(err);
    }
}

export async function visualizationsSave(root, id, title, config) {
    try {
        const response = await axios.put(`${root}api/visualizations/${id}`, {
            title,
            config,
        });
        return response.data;
    } catch (err) {
        rethrowSimple(err);
    }
}
