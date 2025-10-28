<script setup lang="ts">
import { computed, h, ref, watch } from "vue";
import { NSelect, NIcon } from "naive-ui";
import { ExclamationCircleIcon, PlusIcon } from "@heroicons/vue/24/outline";
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
const values = ref<Record<string, InputValuesType>>({});

const mapped = computed(() => {
    values.value = {};
    const result = props.options.map((o) => {
        if (o.value) {
            values.value[o.value.id] = o.value;
        }
        return {
            label: o.label,
            value: o.value?.id || "",
            disabled: o.disabled,
        };
    });

    if (currentValue.value && currentValue.value.id && !values.value[currentValue.value.id]) {
        values.value[currentValue.value.id] = currentValue.value;
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
    currentValue.value = newId ? values.value[newId] : null;
}

function renderLabel(option: { label: string }) {
    return h("div", { class: "my-1 whitespace-normal break-all" }, [
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
            <n-icon class="size-3 mr-1"><ExclamationCircleIcon /></n-icon>
            <span>{{ title }}</span>
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
