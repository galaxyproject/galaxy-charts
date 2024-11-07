import type { PluginType, PluginConfigType } from "@/types";

interface ParsedIncoming {
    root: string;
    visualizationConfig: PluginConfigType;
    visualizationId?: string;
    visualizationPlugin: PluginType;
    visualizationTitle: string;
}

export function parseIncoming(): ParsedIncoming {
    // Access attached data
    const element = document.getElementById("app");
    const incoming = JSON.parse(element?.getAttribute("data-incoming") || "{}") || {};

    // Parse incoming data
    const root = incoming.root || "/";
    const visualizationId = incoming.visualization_id || null;
    const visualizationPlugin = incoming.visualization_plugin || {};
    const visualizationTitle = incoming.visualization_title || "Unnamed Visualization";

    // Parse chart dict
    let visualizationConfig = incoming.visualization_config || {};
    if (incoming.visualization_config?.chart_dict) {
        const chartDict = incoming.visualization_config.chart_dict;
        visualizationConfig.groups = chartDict.groups;
        visualizationConfig.settings = chartDict.settings;
        delete visualizationConfig["chart_dict"];
    }

    return { root, visualizationConfig, visualizationId, visualizationPlugin, visualizationTitle };
}
