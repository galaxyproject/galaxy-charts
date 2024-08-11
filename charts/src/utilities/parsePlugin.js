import { rethrowSimple } from "@/utilities/simpleError";
import { parseXML } from "@/utilities/parseXML";

// parse plugin either from incoming object or xml
export async function parsePlugin(xml, plugin, config) {
    // build plugin from xml if not provided through attached dom data
    if (!plugin) {
        try {
            plugin = await parseXML(xml);
        } catch (err) {
            console.error("Visualization requires configuration from XML or attached `visualization_plugin` details.");
            rethrowSimple(err);
        }
    }
    // filter, format and add defaults to incoming settings and track values
    const settings = parseValues(plugin.settings, config.settings);
    const tracks = parseTracks(plugin.tracks, config.tracks);
    return { plugin, settings, tracks };
}

// format value according to input type
function formatValue(input, inputValue) {
    let value = inputValue ?? input.value;
    if (input.type === "float") {
        value = Number(value);
    }
    return value;
}

function formatConditional(input, values) {
    const result = values || {};
    const testName = input.test_param.name;
    if (!testName) {
        console.error(`Test condition has no name: ${input.name}.`);
    }
    const testValue = result[testName] ?? input.test_param.value;
    for (const inputCase of input.cases) {
        if (inputCase.value === testValue) {
            for (const input of inputCase.inputs) {
                result[input.name] = formatValue(input, result[input.name]);
            }
        }
    }
    return result;
}

// parse values
function parseValues(inputs, values) {
    const result = values || {};
    if (inputs) {
        inputs.forEach((input) => {
            if (input.type === "conditional") {
                result[input.name] = formatConditional(input, result[input.name]);
            } else {
                result[input.name] = formatValue(input, result[input.name]);
            }
        });
    }
    return result;
}

// parse tracks
function parseTracks(inputs, tracks) {
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
