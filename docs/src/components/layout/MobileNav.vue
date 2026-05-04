<script setup lang="ts">
/**
 * Mobile navigation: hamburger button + slide-in drawer hosting the
 * full SidebarNav. Used by the mobile-only header bar in SiteShell when
 * the layout is in sidebar mode (i.e. on docs pages).
 */
import { ref, watch } from "vue";
import type { NavConfig } from "@/config/types";
import SidebarNav from "./SidebarNav.vue";
import ThemeToggle from "./ThemeToggle.vue";

interface Props {
    nav: NavConfig;
    /** Server-resolved current pathname (forwarded to SidebarNav). */
    currentPath: string;
}

const props = defineProps<Props>();
const isOpen = ref(false);

// Lock background scroll while the drawer is open.
watch(isOpen, (open) => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = open ? "hidden" : "";
});

const close = () => (isOpen.value = false);
</script>

<template>
    <button
        type="button"
        class="hamburger"
        :aria-label="isOpen ? 'Close menu' : 'Open menu'"
        :aria-expanded="isOpen"
        @click="isOpen = !isOpen">
        <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
    </button>

    <Teleport to="body">
        <Transition name="fade">
            <div v-if="isOpen" class="overlay" @click="close" />
        </Transition>
        <Transition name="slide">
            <aside v-if="isOpen" class="drawer" role="dialog" aria-modal="true">
                <div class="drawer-header">
                    <span class="text-base font-medium">Menu</span>
                    <button type="button" class="close-btn" aria-label="Close menu" @click="close">
                        <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div class="drawer-body">
                    <SidebarNav :nav="nav" :current-path="currentPath" />
                </div>
                <div class="drawer-footer">
                    <ThemeToggle />
                </div>
            </aside>
        </Transition>
    </Teleport>
</template>

<style scoped>
.hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.5rem;
    background: transparent;
    border: none;
    color: var(--sidebar-text);
    cursor: pointer;
}
.close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.25rem;
    background: transparent;
    border: none;
    color: var(--sidebar-text);
    cursor: pointer;
}
.overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 60;
}
.drawer {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 80vw;
    max-width: 20rem;
    background: var(--sidebar-bg);
    color: var(--sidebar-text);
    border-right: 1px solid var(--sidebar-border);
    z-index: 70;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
}
.drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-bottom: 1px solid var(--sidebar-border);
}
.drawer-body {
    flex: 1;
    padding: 1rem;
    overflow-y: auto;
}
.drawer-footer {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    border-top: 1px solid var(--sidebar-border);
}
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.25s ease;
}
.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}
</style>
