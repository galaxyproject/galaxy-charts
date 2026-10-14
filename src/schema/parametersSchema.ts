/** One JSON Schema for the settings and tracks a plugin accepts, built like Galaxy's tool
 * `parameter_request_schema`: an object per level, `gx_type` naming each input's type, `gx_extensions`
 * the datatypes a dataset input accepts, and a conditional as a `oneOf` keyed by its test parameter. */
import { z } from "zod";
import type { InputCaseType, InputElementType, PluginType } from "../types";
import { selectCase } from "../utilities/parsePlugin";
import { toBoolean } from "../utilities/toBoolean";
import { coerceInputValue, INPUT_TYPES, inputTypeFallback } from "./inputTypes";

type SchemaType = Record<string, unknown>;

const BOUND_KEYWORDS: Record<string, string> = { min: "minimum", max: "maximum" };

/** A declared number, or undefined when the declaration states none. */
function declaredNumber(text: unknown): number | undefined {
    const value = Number(text);
    return String(text ?? "").trim() !== "" && Number.isFinite(value) ? value : undefined;
}

function declared(input: InputElementType, key: string): unknown {
    return input[key as keyof InputElementType];
}

function choices(data: InputElementType["data"]): Array<SchemaType> {
    return (data || []).map((option) => ({ const: option.value, title: option.label }));
}

/** A plugin's label and help, with help placed before what the type itself says it stores. */
function labelled(schema: SchemaType, input: InputElementType): SchemaType {
    if (input.label) {
        schema.title = input.label;
    }
    if (input.help) {
        schema.description = [input.help, schema.description].filter(Boolean).join(" ");
    }
    return schema;
}

/** A comma-separated extension list as an array. */
function extensions(value: unknown): Array<string> {
    return String(value)
        .split(",")
        .map((extension) => extension.trim())
        .filter(Boolean);
}

/** Drops the bounds zod adds to every integer, which state the safe range rather than a limit. */
function storesSchema(stores: z.ZodType): SchemaType {
    const { $schema: _, ...schema } = z.toJSONSchema(stores, {
        override: ({ jsonSchema }) => {
            for (const key of ["minimum", "maximum"] as const) {
                if (Math.abs(Number(jsonSchema[key])) === Number.MAX_SAFE_INTEGER) {
                    delete jsonSchema[key];
                }
            }
        },
    }) as SchemaType;
    return schema;
}

function inputSchema(input: InputElementType): SchemaType {
    if (input.type === "conditional") {
        return conditionalSchema(input);
    }
    const spec = INPUT_TYPES[input.type];
    if (!spec) {
        throw new Error(`Unknown input type '${input.type}'.`);
    }
    // A textarea is a tool text parameter with `area`, as tools name it.
    const schema: SchemaType =
        input.type === "textarea"
            ? { ...storesSchema(spec.stores), gx_type: "gx_text", gx_area: true }
            : { ...storesSchema(spec.stores), gx_type: `gx_${input.type}` };
    for (const bound of spec.bounds || []) {
        const value = declaredNumber(declared(input, bound));
        if (value !== undefined) {
            schema[BOUND_KEYWORDS[bound]] = value;
        }
    }
    const options = spec.options;
    if (options?.kind === "declared") {
        const offered = choices(input.data);
        if (offered.length) {
            schema.oneOf = offered;
        }
    } else if (options) {
        const source: SchemaType = { kind: options.kind };
        for (const key of [options.from, ...(options.filters || [])]) {
            const value = key ? declared(input, key) : undefined;
            if (key === "extension" && value) {
                schema.gx_extensions = extensions(value);
            } else if (key && value !== undefined && value !== null) {
                source[key] = key.startsWith("is_") ? toBoolean(value as string) : value;
            }
        }
        schema.gx_source = source;
    }
    const value = input.value ?? inputTypeFallback(input.type, (flag) => toBoolean(declared(input, flag) as string));
    const fallback = coerceInputValue(input.type, value);
    if (fallback !== undefined && typeof fallback !== "object") {
        schema.default = fallback;
    }
    return labelled(schema, input);
}

/** One branch per case, each fixing the test parameter's value and adding the case's inputs, and,
 * as for tools, a branch without the test parameter for the case its declared value selects. The
 * test parameter owns its name in every branch, so the branches never overlap. */
function conditionalSchema(input: InputElementType): SchemaType {
    const test = input.test_param;
    if (!test?.name) {
        throw new Error(`Conditional '${input.name}' has no test parameter.`);
    }
    const titles = new Map(choices(test.data).map((choice) => [choice.const, choice.title]));
    const caseInputs = (inputCase?: InputCaseType) =>
        (inputCase?.inputs || []).filter((caseInput) => caseInput.name !== test.name);
    // selectCase takes the first case with a value, so a repeated value adds no branch.
    const cases = (input.cases || []).filter(
        (inputCase, index, all) => all.findIndex((other) => other.value === inputCase.value) === index,
    );
    const branches = cases.map((inputCase) => {
        const branch = objectSchema(caseInputs(inputCase));
        const testSchema: SchemaType = { const: inputCase.value };
        if (titles.has(inputCase.value)) {
            testSchema.title = titles.get(inputCase.value);
        }
        branch.properties = { [test.name]: testSchema, ...(branch.properties as SchemaType) };
        branch.required = [test.name];
        return branch;
    });
    const absent = selectCase(input);
    if (absent) {
        branches.push(objectSchema(caseInputs(absent)));
    }
    const schema: SchemaType = {
        type: "object",
        gx_type: "gx_conditional",
        oneOf: branches,
    };
    if (test.value !== undefined) {
        schema.default = { [test.name]: test.value };
    }
    return labelled(schema, { ...input, label: input.label || test.label, help: input.help || test.help });
}

function objectSchema(inputs: Array<InputElementType>): SchemaType {
    return {
        type: "object",
        properties: Object.fromEntries(inputs.map((input) => [input.name, inputSchema(input)])),
        additionalProperties: false,
    };
}

/** The schema of `{settings, tracks}` for one plugin. A value left out takes its default. */
export function parametersSchema(plugin: PluginType): SchemaType {
    const properties: SchemaType = {};
    if (plugin.settings?.length) {
        properties.settings = objectSchema(plugin.settings);
    }
    if (plugin.tracks?.length) {
        properties.tracks = { type: "array", items: objectSchema(plugin.tracks) };
    }
    return {
        $schema: "https://json-schema.org/draft/2020-12/schema",
        title: plugin.html || plugin.name,
        type: "object",
        properties,
        additionalProperties: false,
    };
}
