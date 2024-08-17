export function parseDefaults(inputs) {
    let dv = {};
    if (inputs) {
        inputs.forEach((input) => (dv[input.name] = input.value));
    }
    return dv;
}
