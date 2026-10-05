/** Checks stored values against the input contract a plugin declares: the names it declares, what
 * each type stores, the values a select declares, a number's min and max, and the case a
 * conditional's test value selects. This is stricter than reading a config (parseValues keeps
 * whatever it is given) and than the form on load: the form only lets a user pick a declared select
 * value or enter an in-range number, but shows and re-emits a stored value outside those unchanged. */
import { z } from "zod";
import type { InputElementType, InputValuesType } from "../types";
import { selectCase } from "../utilities/parsePlugin";
import { INPUT_TYPES } from "./inputTypes";

/** One departure, at a dotted path relative to the values that were checked. Branch on `code`: its
 * fields are the contract. `message` is the schema library's wording, for people, and may change. */
export type ValueIssueType =
    | { code: "not_object"; path: string; declared: string[] }
    | { code: "undeclared"; path: string; name: string; declared: string[] }
    | { code: "no_case"; path: string; test: string; cases: string[] }
    | { code: "wrong_shape"; path: string; name: string; message: string; stores: unknown }
    | { code: "not_offered"; path: string; name: string; offered: string[] }
    | { code: "out_of_bounds"; path: string; name: string; min?: number; max?: number };

const isObject = (value: unknown): value is InputValuesType =>
    typeof value === "object" && value !== null && !Array.isArray(value);

const join = (path: string, name: string) => (path ? `${path}.${name}` : name);

/** A declared bound, or undefined when the plugin states none it could mean. */
function bound(text: string | undefined): number | undefined {
    if (text === undefined || String(text).trim() === "") {
        return undefined;
    }
    const value = Number(text);
    return Number.isFinite(value) ? value : undefined;
}

function checkValue(input: InputElementType, value: unknown, path: string): Array<ValueIssueType> {
    const stores = INPUT_TYPES[input.type]?.stores;
    if (stores) {
        const parsed = stores.safeParse(value);
        if (!parsed.success) {
            const message = parsed.error.issues[0]?.message ?? "does not match";
            return [{ code: "wrong_shape", path, name: input.name, message, stores: z.toJSONSchema(stores) }];
        }
    }
    const offered = (input.type === "select" ? input.data || [] : []).map((option) => option.value);
    if (offered.length && !offered.includes(value as string)) {
        return [{ code: "not_offered", path, name: input.name, offered }];
    }
    const [min, max] = [bound(input.min), bound(input.max)];
    if (typeof value === "number" && ((min !== undefined && value < min) || (max !== undefined && value > max))) {
        return [{ code: "out_of_bounds", path, name: input.name, min, max }];
    }
    return [];
}

/** One object's issues. `discriminator` names the test parameter when the object is a conditional's:
 * declared beside the selected case's inputs, and valid once it selects that case. */
function checkLevel(
    inputs: Array<InputElementType>,
    values: unknown,
    path: string,
    discriminator?: string,
): Array<ValueIssueType> {
    const names = inputs.map((input) => input.name);
    const declared = [...new Set(discriminator ? [discriminator, ...names] : names)].filter(Boolean).sort();
    if (!declared.length) {
        return [];
    }
    if (!isObject(values)) {
        return [{ code: "not_object", path, declared }];
    }
    const issues: Array<ValueIssueType> = Object.keys(values)
        .filter((name) => !declared.includes(name))
        .sort()
        .map((name) => ({ code: "undeclared", path: join(path, name), name, declared }));
    for (const input of inputs) {
        if (!Object.hasOwn(values, input.name)) {
            continue;
        }
        const value = values[input.name];
        const here = join(path, input.name);
        if (input.type === "conditional") {
            const testName = input.test_param?.name ?? "";
            const inputCase = selectCase(input, isObject(value) ? value : {});
            if (!inputCase) {
                const cases = (input.cases || []).map((c) => c.value);
                issues.push({ code: "no_case", path: join(here, testName), test: testName, cases });
                continue;
            }
            issues.push(...checkLevel(inputCase.inputs || [], value, here, testName));
        } else if (value !== null && value !== undefined) {
            issues.push(...checkValue(input, value, here));
        }
    }
    return issues;
}

/** Every way `values` departs from the input contract `inputs` declare, in declaration order;
 * empty when it conforms. A value left unset is not a departure. */
export function validateValues(inputs: Array<InputElementType> | undefined, values: unknown): Array<ValueIssueType> {
    return checkLevel(inputs || [], values, "");
}
