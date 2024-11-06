import { rethrowSimple } from "@/utilities/simpleError";
import { GalaxyApi } from "@/api/client";
import { InputValuesType } from "@/types"

interface VisualizationConfig {
    dataset_id: string;
    settings: InputValuesType;
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

export async function visualizationsSave(id: string, title: string, config: VisualizationConfig): Promise<string | undefined> {
    try {
        const { data } = await GalaxyApi().PUT(`/api/visualizations/${id}`, {
            title,
            config,
        });
        return data.id;
    } catch (err) {
        rethrowSimple(err);
    }
}
