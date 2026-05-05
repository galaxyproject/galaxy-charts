/**
 * Single source of truth for the light/dark theme.
 * Consumed by ThemeToggle.vue (as a module) and by SiteShell.astro
 * (which template-stringifies STORAGE_KEY + DEFAULT_DARK into a tiny
 * inline boot script that runs before first paint).
 */

export const STORAGE_KEY = "theme";
export const DEFAULT_DARK = true;

export function applyTheme(dark: boolean): void {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
}

export function readStoredTheme(): "dark" | "light" | null {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        return v === "dark" || v === "light" ? v : null;
    } catch {
        return null;
    }
}

export function writeStoredTheme(dark: boolean): void {
    try {
        localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {
        /* localStorage may be blocked */
    }
}

export function getInitialDark(): boolean {
    const stored = readStoredTheme();
    return stored ? stored === "dark" : DEFAULT_DARK;
}
