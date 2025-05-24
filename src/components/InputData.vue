<script setup lang="ts">
import { ref, watch, h } from "vue";
import { NSelect, NIcon } from "naive-ui";
import { GalaxyApi } from "@/api/client";
import { ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { useDatasetStore } from "@/store/datasetStore";

const { getDataset } = useDatasetStore();

const LIMIT = 100;

type OptionType = {
    label: string;
    value: ValueType;
};

type ValueType = {
    id: string;
    hid: string;
    name: string;
};

const props = defineProps<{
    datasetId?: string;
    extension?: string;
    optional: boolean;
}>();

const currentOptions = ref<Array<{ label: string; value: any; disabled?: boolean }>>([]);
const currentValue = defineModel<ValueType | null>("value");
const isLoading = ref(false);
const selectValue = ref<any | null>(null);

// Load datasets based on filters and query
async function loadDatasets(query?: string): Promise<void> {
    if (props.datasetId) {
        isLoading.value = true;
        try {
            const { data: dataset } = await getDataset(props.datasetId);
            const historyId = dataset.history_id;
            const defaultFilter = `v=dev&order=hid&q=deleted&qv=false&q=visible&qv=true&`;
            const extensionFilter = props.extension ? `q=extension-eq&qv=${props.extension}&` : "";
            const nameFilter = query ? `q=name-contains&qv=${query}&` : "";
            const { data } = await GalaxyApi().GET(
                `/api/histories/${historyId}/contents?${defaultFilter}${extensionFilter}${nameFilter}limit=${LIMIT}`,
            );
            if (data && data.length > 0) {
                const options = data.map((x: ValueType) => ({
                    label: `${x.hid}: ${x.name}`,
                    value: { id: x.id, hid: x.hid, name: x.name },
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
    } else {
        console.debug("Data selector disabled, since `datasetId` is unavailable.");
    }
}

// Update the current selection value
function onUpdate(): void {
    currentValue.value = selectValue.value;
}

function renderLabel(option: OptionType) {
    return h(
        "div",
        {
            class: "my-1 whitespace-normal break-all",
        },
        option.label,
    );
}

function renderTag({ option }: { option: Record<string, any> }) {
    return h(
        "div",
        {
            class: "z-[1] whitespace-nowrap text-ellipsis overflow-hidden",
        },
        option.label,
    );
}

// Sync selectValue (string) with currentValue
watch(
    () => currentValue.value,
    () => {
        selectValue.value = currentValue.value?.name || null;
    },
    { immediate: true },
);

// Initial load
loadDatasets();
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
        :render-label="renderLabel"
        :render-tag="renderTag"
        :options="currentOptions"
        @search="loadDatasets"
        @update:value="onUpdate" />
</template>
