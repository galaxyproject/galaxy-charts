import { GalaxyApi } from "@/api/client";
import { InputValuesType, TranscriptMessageType } from "@/types";
import { rethrowSimple } from "@/utilities/simpleError";

export interface VisualizationConfig {
    dataset_id: string;
    settings: InputValuesType;
    tracks: Array<InputValuesType>;
    transcripts: Array<TranscriptMessageType>;
}

export async function visualizationsCreate(
    type: string,
    title: string,
    config: VisualizationConfig,
): Promise<string | undefined> {
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

export async function visualizationsSave(
    type: string,
    id: string | null,
    title: string,
    config: VisualizationConfig,
): Promise<string | undefined> {
    try {
        if (id) {
            await visualizationsUpdate(id, title, config);
        } else {
            return await visualizationsCreate(type, title, config);
        }
    } catch (err) {
        rethrowSimple(err);
    }
}

export async function visualizationsUpdate(id: string, title: string, config: VisualizationConfig): Promise<undefined> {
    try {
        await GalaxyApi().PUT(`/api/visualizations/${id}`, {
            title,
            config,
        });
    } catch (err) {
        rethrowSimple(err);
    }
}
