<script setup lang="ts">
import { computed, h, ref, watch } from "vue";
import { NSelect, NIcon } from "naive-ui";
import { PlusIcon } from "@heroicons/vue/24/outline";
import type { InputOptionType, InputValuesType } from "@/types";

const props = withDefaults(
    defineProps<{
        loading?: boolean;
        options: Array<InputOptionType>;
        optional?: boolean;
        placeholder?: string;
        title?: string;
        sort?: boolean;
    }>(),
    {
        loading: false,
        optional: false,
        placeholder: "Select a value",
        title: "Please select a value.",
        sort: false,
    },
);

const emit = defineEmits<{
    (event: "search", filter: string): void;
}>();

const currentValue = defineModel<InputValuesType | null>("value");
const selectValue = ref<string | null>(null);

// Build lookup table from id to full value object (pure computed)
const valuesLookup = computed(() => {
    const lookup: Record<string, InputValuesType> = {};
    for (const o of props.options) {
        if (o.value) {
            lookup[o.value.id] = o.value;
        }
    }
    // Include current value if not in options
    if (currentValue.value?.id && !lookup[currentValue.value.id]) {
        lookup[currentValue.value.id] = currentValue.value;
    }
    return lookup;
});

// Map options to NSelect format (pure computed)
const mapped = computed(() => {
    const result = props.options.map((o) => ({
        label: o.label,
        value: o.value?.id || "",
        disabled: o.disabled,
    }));

    // Add current value if not in options
    if (currentValue.value?.id && !props.options.some((o) => o.value?.id === currentValue.value?.id)) {
        result.unshift({
            label: currentValue.value.name || currentValue.value.id,
            value: currentValue.value.id,
            disabled: false,
        });
    }

    if (props.optional) {
        result.unshift({ label: "-- Clear Selection --", value: "", disabled: false });
    }

    if (props.sort) {
        result.sort((a, b) => a.label.localeCompare(b.label));
    }

    return result;
});

function onUpdate(newId: string | null) {
    selectValue.value = newId;
    currentValue.value = newId ? valuesLookup.value[newId] : null;
}

function renderLabel(option: { label: string }) {
    return h("div", { class: "my-1 whitespace-normal break-words" }, [
        h(NIcon, { class: "size-3 mr-1" }, { default: () => h(PlusIcon) }),
        option.label,
    ]);
}

function renderTag({ option }: { option: Record<string, any> }) {
    return h("div", { class: "z-[1] whitespace-nowrap text-ellipsis overflow-hidden" }, option.label ?? "");
}

watch(
    () => currentValue.value,
    (val) => {
        selectValue.value = val?.id ?? null;
    },
    { immediate: true },
);
</script>

<template>
    <div>
        <div v-if="!optional && !currentValue" class="text-red-600 mb-1">
            {{ title }}
        </div>
        <n-select
            filterable
            :placeholder="placeholder"
            :loading="loading"
            :render-label="renderLabel"
            :render-tag="renderTag"
            :options="mapped"
            :value="selectValue"
            @search="emit('search', $event)"
            @update:value="onUpdate" />
    </div>
</template>
