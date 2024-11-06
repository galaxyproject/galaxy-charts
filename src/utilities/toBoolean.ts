export function toBoolean(value: string | boolean | undefined) {
    return String(value).toLowerCase() === "true";
}
