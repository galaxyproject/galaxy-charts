import { rethrowSimple } from "@/utilities/simpleError";
import { parseXML } from "@/utilities/parseXML";
import type { InputElementType, PluginType } from "@/types";

// Define types for plugin configurations, settings, and tracks
interface PluginConfig {
    settings?: Record<string, any>;
    tracks?: Array<Record<string, any>>;
}

interface ParsedPlugin {
    plugin: PluginType;
    settings: Record<string, any>;
    specs: Record<string, any> | undefined;
    tracks: Array<Record<string, any>>;
}

// Parse plugin either from incoming object or XML
export async function parsePlugin(
    xml: string,
    plugin?: PluginType,
    config: PluginConfig = {}
): Promise<ParsedPlugin> {
    // Build plugin from XML if not provided through attached DOM data
    if (!plugin) {
        try {
            plugin = await parseXML(xml);
        } catch (err) {
            console.error("Visualization requires configuration from XML or attached `visualization_plugin` details.");
            rethrowSimple(err);
        }
    }

    // Filter, format, and add defaults to incoming settings and track values
    const settings = parseValues(plugin.settings, config.settings);
    const specs = plugin.specs;
    const tracks = parseTracks(plugin.tracks, config.tracks);

    return { plugin, settings, specs, tracks };
}

// Format value according to input type
function formatValue(input: InputElementType, inputValue: any): any {
    let value = inputValue ?? input.value;
    if (input.type === "float") {
        value = Number(value);
    }
    return value;
}

// Format conditional values based on test cases
function formatConditional(input: InputElementType, values: Record<string, any> = {}): Record<string, any> {
    const result = values;
    const testName = input.test_param?.name;

    if (!testName) {
        console.error(`Test parameter has no name: ${input.name}.`);
    } else {
        const testValue = result[testName] ?? input.test_param?.value;
        for (const inputCase of input.cases || []) {
            if (inputCase.value === testValue) {
                result[testName] = testValue;
                if (inputCase.inputs?.length) {
                    for (const conditionalInput of inputCase.inputs) {
                        result[conditionalInput.name] = formatValue(conditionalInput, result[conditionalInput.name]);
                    }
                }
            }
        }
    }
    return result;
}

// Parse values with conditional handling
function parseValues(inputs?: Array<InputElementType>, values?: Record<string, any>): Record<string, any> {
    const result = values || {};

    inputs?.forEach((input) => {
        if (input.type === "conditional") {
            result[input.name] = formatConditional(input, result[input.name]);
        } else {
            result[input.name] = formatValue(input, result[input.name]);
        }
    });

    return result;
}

// Parse tracks with nested values
function parseTracks(inputs?: Array<InputElementType>, tracks?: Array<Record<string, any>>): Array<Record<string, any>> {
    const values = tracks || [];
    if (inputs) {
        if (values.length === 0) {
            values.push({});
        }
        values.forEach((track, trackIndex) => {
            values[trackIndex] = parseValues(inputs, track);
        });
    }
    return values;
}
