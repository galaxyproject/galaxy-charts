import type { PluginConfigType, PluginIncomingType, PluginType } from "@/types";

interface ParsedIncoming {
    root: string;
    visualizationConfig: PluginConfigType;
    visualizationId: string | null;
    visualizationPlugin: PluginType;
    visualizationTitle: string;
}

export function parseIncoming(incoming?: PluginIncomingType, container = "app"): ParsedIncoming {
    // Access attached data
    if (incoming === undefined) {
        const element = document.getElementById(container);
        if (element) {
            incoming = JSON.parse(element?.dataset.incoming || "{}");
        } else {
            throw new Error(`Container element '${container}' not found.`);
        }
    }

    // Parse incoming data
    const root = incoming?.root ?? "/";
    const visualizationConfig = incoming?.visualization_config ?? {};
    const visualizationId = incoming?.visualization_id ?? null;
    const visualizationPlugin = incoming?.visualization_plugin ?? {};
    const visualizationTitle = incoming?.visualization_title ?? "Unnamed Visualization";

    // Parse chart dict
    return { root, visualizationConfig, visualizationId, visualizationPlugin, visualizationTitle };
}
