<script setup lang="ts">
import { ref } from "vue";
import InputSelect from "@/components/InputSelect.vue";
import type { InputSelectOptionType } from "@/types";
import { useDataTableStore } from "@/store/dataTableStore";

const dataTableStore = useDataTableStore();

type ValueType = {
    id: string;
    columns: Array<string>;
    row: Array<string>;
    table: string;
};

const props = defineProps<{
    datasetId?: string;
    optional?: boolean;
    placeholder?: string;
    tables?: string[];
    title?: string;
}>();

const currentOptions = ref<Array<InputSelectOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadData(): Promise<void> {
    loading.value = true;
    const opts: InputSelectOptionType[] = [];
    if (props.tables && props.tables.length > 0) {
        for (const table of props.tables) {
            try {
                const parsedOptions = await dataTableStore.getDataTable(table);
                opts.push(...parsedOptions);
            } catch (err) {
                console.debug("[charts] Failed to request data table.", err);
            }
        }
    }
    currentOptions.value = opts;
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
