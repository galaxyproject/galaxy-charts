import type {
    InputCaseType,
    InputElementType,
    InputValuesType,
    InputValueType,
    PluginConfigType,
    PluginType,
    TranscriptMessageType,
} from "@/types";
import { coerceInputValue, inputTypeFallback } from "@/schema/inputTypes";
import { toBoolean } from "./toBoolean";

/** The optional string flags an input declares, which a schema fallback may require. */
type InputFlagType = "is_auto" | "is_text" | "is_number";

interface ParsedPlugin {
    plugin: PluginType;
    settings: InputValuesType;
    specs: Record<string, string> | undefined;
    tracks: Array<InputValuesType>;
    transcripts: Array<TranscriptMessageType>;
}

// Parse plugin either from incoming object or XML
export async function parsePlugin(plugin: PluginType, config: PluginConfigType = {}): Promise<ParsedPlugin> {
    const settings = parseValues(plugin.settings, config.settings);
    const specs = plugin.specs;
    const tracks = parseTracks(plugin.tracks, config.tracks);
    const transcripts = config.transcripts || [];
    return { plugin, settings, specs, tracks, transcripts };
}

// Format value according to input type
function formatValue(input: InputElementType, inputValue: InputValueType): InputValueType {
    // The schema owns the fallback, so a value resolves here rather than when an input mounts.
    const value =
        inputValue ?? input.value ?? inputTypeFallback(input.type, (flag) => toBoolean(input[flag as InputFlagType]));
    return coerceInputValue(input.type, value);
}

/** The case a conditional's stored values select: its stored test value, else the test parameter's
 * default, matched against each case's label as a string. Undefined when no case matches. */
export function selectCase(input: InputElementType, values: InputValuesType = {}): InputCaseType | undefined {
    const testName = input.test_param?.name;
    if (!testName) {
        return undefined;
    }
    const testValue = values[testName] ?? input.test_param?.value;
    return input.cases?.find((inputCase) => String(inputCase.value) === String(testValue));
}

// Format conditional values based on test cases
function formatConditional(input: InputElementType, values: InputValuesType = {}): InputValuesType {
    let result = { ...values };
    const testName = input.test_param?.name;

    if (!testName) {
        console.error(`[charts] Test parameter has no name: ${input.name}.`);
        return result;
    }
    const inputCase = selectCase(input, result);
    if (inputCase) {
        result[testName] = inputCase.value;
        if (inputCase.inputs?.length) {
            result = parseValues(inputCase.inputs, result);
        }
    }
    return result;
}

// Parse values with conditional handling
export function parseValues(inputs?: Array<InputElementType>, values?: InputValuesType): InputValuesType {
    const result = { ...values };

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
    const values = [...(tracks || [])];
    if (inputs) {
        if (values.length === 0) {
            values.push({});
        }
        return values.map((track) => parseValues(inputs, track));
    }
    return values;
}
