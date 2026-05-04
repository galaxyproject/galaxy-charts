import type { NavConfig, NavItem } from "@/config/types";

export interface PageNeighbors {
    prev: NavItem | null;
    next: NavItem | null;
}

/**
 * Given the linear page order from `nav.sections`, return the previous and
 * next internal pages relative to `slug`. External links are excluded.
 *
 * Used by `PageLayout` to render the prev/next footer strip.
 */
export function pageNeighbors(nav: NavConfig, slug?: string): PageNeighbors {
    const flat: NavItem[] = nav.sections.flatMap((section) => section.items.filter((item) => !item.external));
    if (!slug) return { prev: null, next: null };
    const currentHref = `/${slug}`;
    const idx = flat.findIndex((item) => item.href === currentHref);
    return {
        prev: idx > 0 ? flat[idx - 1] : null,
        next: idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null,
    };
}
