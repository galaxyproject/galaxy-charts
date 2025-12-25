<script setup lang="ts">
import type { Component } from "vue";
import { NButton, NIcon, NTooltip } from "naive-ui";

const props = withDefaults(
    defineProps<{
        cls?: string;
        icon: Component;
        title: string;
        visible?: boolean;
    }>(),
    {
        cls: "",
        visible: true,
    },
);

const emit = defineEmits<{
    (event: "click"): void;
}>();
</script>

<template>
    <n-tooltip v-if="visible" trigger="hover" :to="false">
        <template #trigger>
            <span :class="cls">
                <n-button
                    circle
                    :data-description="`sidebutton ${title.toLowerCase()}`"
                    secondary
                    type="info"
                    strong
                    @click="emit('click')">
                    <template #icon>
                        <n-icon><component :is="icon" /></n-icon>
                    </template>
                </n-button>
            </span>
        </template>
        <span class="text-xs">{{ title }}</span>
    </n-tooltip>
</template>
