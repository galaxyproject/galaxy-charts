import { rethrowSimple } from "@/utilities/simpleError";
import { GalaxyApi } from "@/api/client";

export async function visualizationsCreate(type, title, config) {
    try {
        const { data } = await GalaxyApi().POST("/api/visualizations", {
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
    try {
        const response = await GalaxyApi().PUT(`/api/visualizations/${id}`, {
            title,
            config,
        });
        return response.data;
    } catch (err) {
        rethrowSimple(err);
    }
}
