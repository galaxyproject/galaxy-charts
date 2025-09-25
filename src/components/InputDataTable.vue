<script setup lang="ts">
import { ref } from "vue";
import { GalaxyApi } from "@/api/client";
import InputSelect from "@/components/InputSelect.vue";
import type { InputSelectOptionType } from "@/types";

type TableType = {
    columns?: Array<string>;
    fields?: Array<Array<string>>;
};

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

function parseOptions(table: string, tableData: TableType) {
    const columns = tableData.columns || [];
    const fields = tableData.fields || [];
    const length = columns.length || 0;
    const options: Array<InputSelectOptionType> = [];
    if (length > 0) {
        if (fields && fields.length > 0) {
            const nameCol = Math.max(columns.indexOf("name"), 0);
            const valueCol = Math.max(columns.indexOf("value"), 0);
            fields.forEach((row: Array<string>) => {
                const validRow = row.length === length;
                options.push({
                    label: validRow ? row[nameCol] : row[0],
                    value: {
                        id: validRow ? row[valueCol] : row[0],
                        columns: columns,
                        row: row,
                        table: table,
                    },
                });
            });
        }
    } else {
        console.debug(`[charts] No columns found in ${table}.`);
    }
    return options;
}

async function loadData(): Promise<void> {
    loading.value = true;
    const opts: InputSelectOptionType[] = [];
    if (props.tables && props.tables.length > 0) {
        for (const table of props.tables) {
            try {
                const { data } = await GalaxyApi().GET(`/api/tool_data/${table}`);
                opts.push(...parseOptions(table, data));
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
