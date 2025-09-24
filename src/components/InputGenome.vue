<script setup lang="ts">
import { ref } from "vue";
import { GalaxyApi } from "@/api/client";
import { useDatasetStore } from "@/store/datasetStore";
import InputSelect from "@/components/InputSelect.vue";
import type { InputSelectOptionType } from "@/types";

const { getDataset } = useDatasetStore();

type ValueType = {
    id: string;
    name: string;
};

defineProps<{
    datasetId?: string;
    optional?: boolean;
}>();

const currentOptions = ref<Array<InputSelectOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadGenomes(): Promise<void> {
    loading.value = true;
    try {
        const { data } = await GalaxyApi().GET("/api/genomes");
        if (data && data.length > 0) {
            const options = data.map((x: [string, string]) => ({
                label: x[0],
                value: { id: x[1], name: x[0] },
            }));
            currentOptions.value = options;
        }
    } catch (err) {
        console.log(err);
    } finally {
        loading.value = false;
    }
}

loadGenomes();
</script>

<template>
    <InputSelect
        v-model:value="currentValue"
        :loading="loading"
        :options="currentOptions"
        :optional="optional"
        placeholder="Select a genome"
        title="Please select a genome." />
</template>
