interface Config {
    root?: string;
    title?: string;
    visualization_config?: {
        chart_dict?: {
            groups?: any;
            settings?: any;
        };
        [key: string]: any;
    };
    [key: string]: any;
}

interface ParsedIncoming {
    root: string;
    visualizationConfig: Config;
    visualizationId?: string;
    visualizationPlugin?: any;
    visualizationTitle: string;
}

export function parseIncoming(config: Config): ParsedIncoming {
    // Access attached data
    const element = document.getElementById("app");
    const incoming = JSON.parse(element?.getAttribute("data-incoming") || "{}") || {};

    // Parse incoming data
    const root = incoming.root || config?.root || "/";
    const visualizationId = incoming.visualization_id;
    const visualizationPlugin = incoming.visualization_plugin;
    const visualizationTitle = incoming.visualization_title || config?.title || "Unnamed Visualization";

    // Parse chart dict
    let visualizationConfig = incoming.visualization_config || config;
    if (incoming.visualization_config?.chart_dict) {
        const chartDict = incoming.visualization_config.chart_dict;
        visualizationConfig.groups = chartDict.groups;
        visualizationConfig.settings = chartDict.settings;
        delete visualizationConfig["chart_dict"];
    }

    return { root, visualizationConfig, visualizationId, visualizationPlugin, visualizationTitle };
}
