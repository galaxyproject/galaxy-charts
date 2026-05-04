/** Minimum heading depth eligible for the right-column TOC (h2). */
export const TOC_MIN_DEPTH = 2;
/** Maximum heading depth eligible for the right-column TOC (h4). */
export const TOC_MAX_DEPTH = 4;
/** A TOC needs at least this many qualifying headings to render. */
export const TOC_MIN_COUNT = 2;

export interface Heading {
    depth: number;
    slug: string;
    text: string;
}

/** Filter a page's headings down to the set rendered in the TOC. */
export function visibleHeadings(headings: Heading[]): Heading[] {
    return headings.filter((h) => h.depth >= TOC_MIN_DEPTH && h.depth <= TOC_MAX_DEPTH);
}

/** Whether a TOC has enough content to be worth rendering. */
export function hasToc(headings: Heading[]): boolean {
    return visibleHeadings(headings).length >= TOC_MIN_COUNT;
}
