<script setup lang="ts">
import type { Component } from "vue";
import { NButton, NIcon, NTooltip } from "naive-ui";

const props = withDefaults(
    defineProps<{
        buttonClass?: string;
        circle?: boolean;
        disabled?: boolean;
        icon: Component;
        secondary?: boolean;
        title: string;
        type?: "error" | "info" | "primary" | "warning";
        visible?: boolean;
    }>(),
    {
        cls: "",
        circle: false,
        disabled: false,
        secondary: false,
        type: "info",
    },
);

const emit = defineEmits<{
    (event: "click"): void;
}>();
</script>

<template>
    <n-tooltip trigger="hover" :to="false">
        <template #trigger>
            <span :class="buttonClass">
                <n-button
                    :circle="circle"
                    :data-description="`sidebutton ${title.toLowerCase()}`"
                    :disabled="disabled"
                    :secondary="secondary"
                    strong
                    :type="props.type"
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
