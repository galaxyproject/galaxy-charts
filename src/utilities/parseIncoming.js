export function parseIncoming(config) {
    // access attached data
    const element = document.getElementById("app");
    const incoming = JSON.parse(element.getAttribute("data-incoming")) || {};

    // parse incoming data
    const root = incoming.root || config?.root || "/";
    const visualizationId = incoming.visualization_id;
    const visualizationPlugin = incoming.visualization_plugin;
    const visualizationTitle = incoming.visualization_title || config?.title || "Unnamed Visualization";

    // parse chart dict
    let visualizationConfig = incoming.visualization_config || config;
    if (incoming.visualization_config?.chart_dict) {
        const chartDict = incoming.visualization_config.chart_dict;
        visualizationConfig.groups = chartDict.groups;
        visualizationConfig.settings = chartDict.settings;
        delete visualizationConfig["chartDict"];
    }
    return { root, visualizationConfig, visualizationId, visualizationPlugin, visualizationTitle };
}
