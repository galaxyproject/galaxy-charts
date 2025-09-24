<script setup lang="ts">
import { ref, watch, h } from "vue";
import { NSelect, NIcon } from "naive-ui";
import { ExclamationCircleIcon, PlusIcon } from "@heroicons/vue/24/outline";

type OptionType = {
    disabled?: boolean;
    label: string;
    value: any;
    type?: string;
};

withDefaults(
    defineProps<{
        loading?: boolean;
        options: Array<OptionType>;
        optional?: boolean;
        placeholder?: string;
        title?: string;
    }>(),
    {
        loading: false,
        optional: false,
        placeholder: "Select a value",
        title: "Please select a value.",
    },
);

const emit = defineEmits<{
    (event: "search", filter: string): void;
}>();

const currentValue = defineModel<any | null>("value");
const selectValue = ref<string | number | null>(null);

// Update the current selection value
function onUpdate(newValue: any): void {
    currentValue.value = newValue;
}

function renderLabel(option: OptionType) {
    return h(
        "div",
        {
            class: "my-1 whitespace-normal break-all",
        },
        [
            h(
                NIcon,
                { class: "size-3 mr-1" },
                {
                    default: () => h(PlusIcon),
                },
            ),
            option.label,
        ],
    );
}

function renderTag({ option }: { option: Record<string, any> }) {
    return h(
        "div",
        {
            class: "z-[1] whitespace-nowrap text-ellipsis overflow-hidden",
        },
        option.label,
    );
}

// Sync selectValue (string) with currentValue
watch(
    () => currentValue.value,
    () => {
        selectValue.value = currentValue.value?.name || null;
    },
    { immediate: true },
);
</script>

<template>
    <div v-if="options?.length > 0">
        <div v-if="!optional && !currentValue" class="text-red-600 mb-1">
            <n-icon class="size-3 mr-1"><ExclamationCircleIcon /></n-icon>
            <span>{{ title }}</span>
        </div>
        <n-select
            filterable
            placeholder="placeholder"
            :loading="loading"
            :render-label="renderLabel"
            :render-tag="renderTag"
            :options="options"
            :value="selectValue"
            @search="emit('search', $event)"
            @update:value="onUpdate" />
    </div>
    <div v-else>Selection deferred.</div>
</template>
