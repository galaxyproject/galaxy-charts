import { rethrowSimple } from "@/utilities/simpleError";
import { GalaxyApi } from "@/api/client";

interface VisualizationConfig {
    [key: string]: any;
}

export async function visualizationsCreate(type: string, title: string, config: VisualizationConfig): Promise<string | undefined> {
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

export async function visualizationsSave(id: string, title: string, config: VisualizationConfig): Promise<any | undefined> {
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
