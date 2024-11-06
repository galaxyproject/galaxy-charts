import type { InputElementType, InputValuesType } from "@/types";

export function parseDefaults(inputs?: Array<InputElementType>): InputValuesType {
    const dv: InputValuesType = {};

    if (inputs) {
        inputs.forEach((input) => {
            if (input.name) {
                dv[input.name] = input.value ?? null;
            } else {
                console.debug("Warning: Detected input element with no name.");
            }
        });
    }

    return dv;
}
