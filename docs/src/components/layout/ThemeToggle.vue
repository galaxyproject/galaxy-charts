<script setup lang="ts">
/**
 * Light/dark mode toggle. Persists choice in localStorage; falls back to
 * `prefers-color-scheme` for first-time visitors. Toggles the `.dark` class
 * on `<html>` so Tailwind v4's `dark:` variant applies site-wide.
 */
import { ref, onMounted } from "vue";

const STORAGE_KEY = "theme";
const isDark = ref(false);

function applyTheme(dark: boolean) {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", dark);
}

function setTheme(dark: boolean) {
    isDark.value = dark;
    applyTheme(dark);
    try {
        localStorage.setItem(STORAGE_KEY, dark ? "dark" : "light");
    } catch {
        /* localStorage may be blocked — fail quietly. */
    }
}

function toggle() {
    setTheme(!isDark.value);
}

onMounted(() => {
    let stored: string | null = null;
    try {
        stored = localStorage.getItem(STORAGE_KEY);
    } catch {
        /* ignore */
    }
    const prefersDark = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : prefersDark;
    isDark.value = dark;
    applyTheme(dark);
});
</script>

<template>
    <button
        type="button"
        class="theme-toggle"
        :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        @click="toggle">
        <svg v-if="isDark" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
        <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
    </button>
</template>

<style scoped>
.theme-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: none;
    cursor: pointer;
    color: rgb(156 163 175);
    transition:
        color 0.2s ease,
        transform 0.2s ease;
}
.theme-toggle:hover {
    color: var(--color-galaxy-gold);
    transform: scale(1.15);
}
</style>
