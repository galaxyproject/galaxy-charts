<script setup lang="ts">
import { ref } from 'vue';
import type { NavConfig, NavItem } from '@/config/types';
import { resolveHref, samePath } from '@/utils/url';
import NavLink from './NavLink.vue';

interface Props {
  nav: NavConfig;
  /** Server-resolved current pathname. Used for both SSR and hydration so
      the active link / open section don't flash on first paint. */
  currentPath: string;
}

const props = defineProps<Props>();

const isCurrentPage = (href: string) => samePath(props.currentPath, href);
const isActive = (item: NavItem) => isCurrentPage(resolveHref(item.href, item.external));

// Compute initial open sections eagerly so SSR + hydration match.
const initiallyOpen = new Set<string>(
  props.nav.sections
    .filter((section) => section.defaultOpen || section.items.some(isActive))
    .map((section) => section.title),
);

const openSections = ref<Set<string>>(initiallyOpen);

function toggle(title: string) {
  if (openSections.value.has(title)) openSections.value.delete(title);
  else openSections.value.add(title);
  openSections.value = new Set(openSections.value);
}

const isOpen = (title: string) => openSections.value.has(title);
</script>

<template>
  <nav class="space-y-2">
    <div v-for="section in nav.sections" :key="section.title">
      <button
        type="button"
        class="section-trigger"
        :aria-expanded="isOpen(section.title)"
        @click="toggle(section.title)"
      >
        <span>{{ section.title }}</span>
        <svg
          class="h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': isOpen(section.title) }"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <div v-show="isOpen(section.title)" class="pl-3 space-y-1 mt-1">
        <NavLink v-for="item in section.items" :key="item.href" :item="item" :active="isActive(item)" />
      </div>
    </div>
  </nav>
</template>

<style scoped>
.section-trigger {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209 213 219);
  background: transparent;
  border: none;
  cursor: pointer;
  transition:
    background-color 0.15s,
    color 0.15s;
}
.section-trigger:hover {
  background-color: var(--color-medium-bg);
  color: white;
}
</style>
