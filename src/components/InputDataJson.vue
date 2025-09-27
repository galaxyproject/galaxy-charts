<script setup lang="ts">
import { ref } from "vue";
import InputSelect from "@/components/InputSelect.vue";
import type { InputSelectOptionType } from "@/types";

type ValueType = {
    id: string;
    name?: string;
};

const props = defineProps<{
    datasetId?: string;
    optional?: boolean;
    placeholder?: string;
    title?: string;
    url: string;
}>();

const currentOptions = ref<Array<InputSelectOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadData(): Promise<void> {
    loading.value = true;
    let opts: InputSelectOptionType[] = [];
    try {
        console.debug("[charts] Requesting data json from:", props.url);
        const response = await fetch(props.url);
        if (response.ok) {
            const result = await response.json();
            opts = result.map((entry: ValueType) => ({
                label: entry.name || entry.id,
                value: { ...entry },
            }));
        } else {
            console.error("[charts] Failed to request data json.", response.status);
        }
    } catch (err) {
        console.debug("[charts] Failed to request data json.", err);
    }
    if (opts.length === 0) {
        console.debug("[charts] No entries found in data json.");
    } else {
        currentOptions.value = opts;
    }
    loading.value = false;
}

loadData();
</script>

<template>
    <InputSelect
        v-model:value="currentValue"
        :loading="loading"
        :options="currentOptions"
        :optional="optional"
        :placeholder="placeholder"
        :title="title" />
</template>
