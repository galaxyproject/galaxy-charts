<script setup lang="ts">
import { ref } from "vue";
import InputSelect from "@/components/InputSelect.vue";
import type { InputSelectOptionType } from "@/types";
import { useDataJsonStore } from "@/store/dataJsonStore";

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

const { getDataJson } = useDataJsonStore();

async function loadData(): Promise<void> {
    loading.value = true;
    try {
        console.debug("[charts] Requesting data json from:", props.url);
        const opts = await getDataJson(props.url);
        if (opts.length === 0) {
            console.debug("[charts] No entries found in data json.");
        } else {
            currentOptions.value = opts;
        }
    } catch (err) {
        console.debug("[charts] Failed to request data json.", err);
    } finally {
        loading.value = false;
    }
}

loadData();
</script>

<template>
    <InputSelect
        v-model:value="currentValue"
        :loading="loading"
        :options="currentOptions"
        :optional="props.optional"
        :placeholder="props.placeholder"
        :title="props.title" />
</template>
