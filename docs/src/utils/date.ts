/**
 * Default locale used by `formatDate`. Override per-call when needed.
 * (Kept here rather than a config field — flip in one place if the docs
 * become multilingual.)
 */
export const DEFAULT_LOCALE = "en-US";

export function toIsoDate(d: Date | string | undefined): string {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    return Number.isNaN(date.getTime()) ? "" : date.toISOString();
}

export function formatDate(d: Date | string | undefined, locale: string = DEFAULT_LOCALE): string {
    if (!d) return "";
    const date = d instanceof Date ? d : new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleDateString(locale, { year: "numeric", month: "long", day: "numeric" });
}
