import axios from "axios";
import { rethrowSimple } from "@/utilities/simpleError";
import { useConfigStore } from "@/store/configStore";

export async function visualizationsCreate(type, title, config) {
    const configStore = useConfigStore();
    try {
        const { data } = await axios.post(`${configStore.getRoot()}api/visualizations`, {
            type,
            title,
            config,
        });
        return data.id;
    } catch (err) {
        rethrowSimple(err);
    }
}

export async function visualizationsSave(id, title, config) {
    const configStore = useConfigStore();
    try {
        const response = await axios.put(`${configStore.getRoot()}api/visualizations/${id}`, {
            title,
            config,
        });
        return response.data;
    } catch (err) {
        rethrowSimple(err);
    }
}
