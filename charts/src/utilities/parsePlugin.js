import axios from "axios";
import { parseXML } from "@/utilities/parseXML";

// parse plugin either from incoming object or xml
export async function parsePlugin(xml, plugin, settings) {
    if (plugin) {
        return parseConfig(plugin, settings);
    } else if (xml) {
        const response = await axios.get(xml);
        return parseConfig(parseXML(xml, response.data), settings);
    } else {
        console.error("Visualization requires configuration from XML or attached `visualization_plugin` details.");
    }
}

// parse plugin configuration
function parseConfig(plugin, settings) {
    settings = settings || {};
    if (plugin.settings) {
        plugin.settings.forEach((input) => {
            let value = settings[input.name] ?? input.value;
            if (input.type === "float") {
                value = Number(value);
            }
            settings[input.name] = value;
        });
    }
    return { plugin, settings };
}
