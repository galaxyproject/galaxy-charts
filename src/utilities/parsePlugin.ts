import type { InputAtomicType, InputElementType, InputValuesType, PluginConfigType, PluginType } from "@/types";
import { toBoolean } from "./toBoolean";

interface ParsedPlugin {
    plugin: PluginType;
    settings: InputValuesType;
    specs: Record<string, string> | undefined;
    tracks: Array<InputValuesType>;
}

// Parse plugin either from incoming object or XML
export async function parsePlugin(plugin: PluginType, config: PluginConfigType = {}): Promise<ParsedPlugin> {
    const settings = parseValues(plugin.settings, config.settings);
    const specs = plugin.specs;
    const tracks = parseTracks(plugin.tracks, config.tracks);
    return { plugin, settings, specs, tracks };
}

// Format value according to input type
function formatValue(input: InputElementType, inputValue: InputAtomicType): InputAtomicType {
    let value = inputValue ?? input.value;
    if (["float", "integer"].includes(input.type)) {
        value = Number(value);
    } else if (input.type === "boolean") {
        value = toBoolean(value);
    }
    return value;
}

// Format conditional values based on test cases
function formatConditional(input: InputElementType, values: InputValuesType = {}): InputValuesType {
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
                    parseValues(inputCase.inputs, result);
                }
            }
        }
    }
    return result;
}

// Parse values with conditional handling
export function parseValues(inputs?: Array<InputElementType>, values?: InputValuesType): InputValuesType {
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
function parseTracks(inputs?: Array<InputElementType>, tracks?: Array<InputValuesType>): Array<InputValuesType> {
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
