/**
 * Resolve an internal href against the configured `BASE_URL`.
 * External links (anything starting with `http` or flagged via `external`) pass through.
 *
 * Used by every component that renders nav/page links so that the base-path
 * prefix only lives in one place.
 */
export function resolveHref(href: string, external?: boolean): string {
    if (external || href.startsWith("http")) return href;
    const base = (import.meta.env.BASE_URL ?? "/").replace(/\/$/, "");
    const path = href.startsWith("/") ? href : "/" + href;
    return base + path;
}

/** Strip a trailing slash so `/foo/` and `/foo` compare as equal. */
export function normalizePath(path: string): string {
    return path.replace(/\/+$/, "");
}

/** Whether two paths refer to the same page (ignoring trailing slashes). */
export function samePath(a: string, b: string): boolean {
    return normalizePath(a) === normalizePath(b);
}
