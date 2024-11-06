interface Input {
    name?: string;
    value?: any;
}

export function parseDefaults(inputs?: Array<Input>): Record<string, any> {
    const dv: Record<string, any> = {};

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
