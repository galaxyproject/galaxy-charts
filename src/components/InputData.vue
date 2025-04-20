<script setup lang="ts">
import { ref, defineModel, watch } from "vue";
import { NSelect, NIcon } from "naive-ui";
import { GalaxyApi } from "@/api/client";
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";

const LIMIT = 100;

// Value type
type ValueType = {
    id: string;
    name: string;
};

// Define props with TypeScript
const props = defineProps<{
    extension?: string;
    optional: boolean;
}>();

// Define the model
const currentOptions = ref<Array<{ label: string; value: any; disabled?: boolean }>>([]);
const currentValue = defineModel<ValueType | null>("value");
const isLoading = ref(false);
const selectValue = ref<any | null>(null);

// Load datasets based on filters and query
async function loadDatasets(query?: string): Promise<void> {
    isLoading.value = true;
    try {
        const extensionFilter = props.extension ? `q=extension-eq&qv=${props.extension}&` : "";
        const nameFilter = query ? `q=name-contains&qv=${query}` : "";
        const { data } = await GalaxyApi().GET(`/api/datasets?limit=${LIMIT}&${extensionFilter}${nameFilter}`);
        if (data && data.length > 0) {
            const options = data.map((x: ValueType) => ({
                label: x.name,
                value: { id: x.id, name: x.name },
            }));
            options.push({ label: "...filter for more", value: null, disabled: true });
            if (props.optional) {
                options.unshift({ label: "-- Clear Selection --", value: null });
            }
            currentOptions.value = options;
        }
    } catch (err) {
        console.log(err);
    } finally {
        isLoading.value = false;
    }
}

// Update the current selection value
function onUpdate(): void {
    currentValue.value = selectValue.value;
}

// Load initial datasets when the component is mounted
loadDatasets();

// Add watcher
watch(
    () => currentValue.value,
    () => {
        selectValue.value = currentValue.value?.name;
    },
    { immediate: true },
);
</script>

<template>
    <div v-if="!optional && !currentValue" class="text-red-600 mb-1">
        <n-icon class="size-3 mr-1"><ExclamationCircleIcon /></n-icon>
        <span>Please select a dataset.</span>
    </div>
    <n-select
        v-model:value="selectValue"
        filterable
        placeholder="Select a Dataset"
        :loading="isLoading"
        :options="currentOptions"
        @search="loadDatasets"
        @update:value="onUpdate" />
</template>
