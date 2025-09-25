<script setup lang="ts">
import { ref } from "vue";
import { GalaxyApi } from "@/api/client";
import InputSelect from "@/components/InputSelect.vue";
import type { InputSelectOptionType } from "@/types";

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
    title?: string;
    table?: string;
}>();

const currentOptions = ref<Array<InputSelectOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadData(): Promise<void> {
    loading.value = true;
    try {
        const { data } = await GalaxyApi().GET(`/api/tool_data/${props.table}`);
        const columns = data?.columns;
        const fields = data?.fields;
        const length = columns?.length;
        if (length > 0) {
            if (fields && fields.length > 0) {
                const nameCol = Math.max(columns.indexOf("name"), 0);
                const valueCol = Math.max(columns.indexOf("value"), 0);
                const options = fields.map((row: Array<string>) => {
                    const validRow = row.length === length;
                    return {
                        label: validRow ? row[nameCol] : row[0],
                        value: {
                            id: validRow ? row[valueCol] : row[0],
                            columns: columns,
                            row: row,
                            table: props.table,
                        },
                    };
                });
                currentOptions.value = options;
            }
        } else {
            console.debug(`[IGV] No columns found in ${props.table}`);
        }
    } catch (err) {
        console.log(err);
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
        :optional="optional"
        :placeholder="placeholder"
        :title="title" />
</template>
