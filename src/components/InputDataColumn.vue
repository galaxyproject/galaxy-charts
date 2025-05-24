<script setup lang="ts">
import { ref, watch } from "vue";
import { NInput, NSelect } from "naive-ui";
import { parseColumns } from "@/utilities/parseColumns";
import { useDatasetStore } from "@/store/datasetStore";

// Get dataset store
const { getDataset } = useDatasetStore();

// Define props with TypeScript
const props = defineProps<{
    datasetId: string;
    isAuto: boolean;
    isText: boolean;
    isNumber: boolean;
}>();

// Define refs with appropriate types
const currentOptions = ref<Array<{ label: string; value: string }>>([]);
const currentValue = defineModel<string | null>("value");

// Load columns based on dataset and filters
async function loadColumns(): Promise<void> {
    if (props.datasetId) {
        try {
            const { data: dataset } = await getDataset(props.datasetId);
            const columns = parseColumns(dataset, props.isAuto, props.isText, props.isNumber);
            currentOptions.value = columns;
            initializeValue();
        } catch (err) {
            console.debug(err);
        }
    } else {
        console.debug("Data column selector disabled, since `datasetId` is unavailable.");
    }
}

// Initialize current value based on options
function initializeValue(): void {
    if (currentOptions.value.length > 0 && currentValue.value === null) {
        currentValue.value = currentOptions.value[0].value;
    }
}

// Call loadColumns on component mount
loadColumns();

// Watch for changes in currentValue and re-initialize if needed
watch(
    () => currentValue.value,
    () => initializeValue(),
);
</script>

<template>
    <n-select v-if="datasetId" v-model:value="currentValue" :options="currentOptions" />
    <n-input v-else v-model:value="currentValue" />
</template>
