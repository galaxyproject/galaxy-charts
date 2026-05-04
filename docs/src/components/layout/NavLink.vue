<script setup lang="ts">
import type { NavItem } from '@/config/types';
import { resolveHref } from '@/utils/url';

interface Props {
  item: NavItem;
  /** Style variant: top/bottom flat links use 'flat'; section items use 'nested'. */
  variant?: 'flat' | 'nested';
  active?: boolean;
}

const { item, variant = 'nested', active = false } = defineProps<Props>();
</script>

<template>
  <a
    :href="resolveHref(item.href, item.external)"
    :target="item.external ? '_blank' : undefined"
    :rel="item.external ? 'noopener noreferrer' : undefined"
    :class="[variant === 'flat' ? 'nav-link' : 'nav-sublink', active && (variant === 'flat' ? 'nav-link-active' : 'nav-sublink-active')]"
  >
    <span>{{ item.label }}</span>
    <svg
      v-if="item.external"
      class="h-3 w-3 ml-1 opacity-50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  </a>
</template>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(209 213 219);
  transition:
    background-color 0.15s,
    color 0.15s;
}
.nav-link:hover {
  background-color: var(--color-medium-bg);
  color: white;
}
.nav-link-active {
  color: var(--color-galaxy-gold);
}
.nav-sublink {
  display: flex;
  align-items: center;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  color: rgb(156 163 175);
  transition:
    background-color 0.15s,
    color 0.15s;
}
.nav-sublink:hover {
  background-color: var(--color-medium-bg);
  color: white;
}
.nav-sublink-active {
  color: var(--color-galaxy-gold);
  background-color: var(--color-medium-bg);
}
</style>
