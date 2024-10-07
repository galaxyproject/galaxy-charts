export function parseDefaults(inputs) {
    let dv = {};
    if (inputs) {
        inputs.forEach((input) => {
            if (input.name) {
                dv[input.name] = input.value || null;
            } else {
                console.debug("Warning: Detected input element with no name.");
            }
        });
    }
    return dv;
}
