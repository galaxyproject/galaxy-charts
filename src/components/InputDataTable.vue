<script setup lang="ts">
import { ref } from "vue";
import InputSelect from "@/components/InputSelect.vue";
import type { InputOptionType } from "@/types";
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

const currentOptions = ref<Array<InputOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadData(): Promise<void> {
    loading.value = true;
    const opts: InputOptionType[] = [];
    const seen = new Set<string>();

    if (props.tables && props.tables.length > 0) {
        for (const table of props.tables) {
            try {
                const parsedOptions = await dataTableStore.getDataTable(table);
                for (const option of parsedOptions) {
                    const id = option?.value?.id;
                    if (id && !seen.has(id)) {
                        seen.add(id);
                        opts.push(option);
                    }
                }
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
