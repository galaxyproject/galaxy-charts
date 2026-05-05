<script setup lang="ts">
/**
 * Light/dark mode toggle button. Storage + resolution logic in @/utils/theme.
 */
import { ref, onMounted } from "vue";
import { applyTheme, writeStoredTheme } from "@/utils/theme";

const isDark = ref(false);

function setTheme(dark: boolean) {
    isDark.value = dark;
    applyTheme(dark);
    writeStoredTheme(dark);
}

function toggle() {
    setTheme(!isDark.value);
}

onMounted(() => {
    // The pre-paint boot script in SiteShell already resolved the theme and
    // set the `.dark` class. Mirror that into our reactive state.
    isDark.value = document.documentElement.classList.contains("dark");
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
