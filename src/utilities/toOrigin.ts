/** An absolute url's origin, or undefined. */
export function toOrigin(url: string): string | undefined {
    try {
        return new URL(url).origin;
    } catch {
        return undefined;
    }
}
