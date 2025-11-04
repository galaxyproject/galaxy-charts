<script setup lang="ts">
import { ref } from "vue";
import { historiesGetContents } from "@/api/histories";
import { useDatasetStore } from "@/store/datasetStore";
import InputSelect from "@/components/InputSelect.vue";
import type { InputOptionType } from "@/types";

const { getDataset } = useDatasetStore();

const LIMIT = 100;

type ValueType = {
    id: string;
    extension: string;
    hid: string;
    name: string;
};

const props = defineProps<{
    datasetId?: string;
    extension?: string;
    optional?: boolean;
}>();

const currentOptions = ref<Array<InputOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadDatasets(query?: string): Promise<void> {
    if (props.datasetId) {
        loading.value = true;
        try {
            const { data: dataset } = await getDataset(props.datasetId);
            const contents = await historiesGetContents(dataset.history_id, query, props.extension, LIMIT);
            if (contents && contents.length > 0) {
                const options = contents.map((x: ValueType) => ({
                    label: `${x.hid}: ${x.name}`,
                    value: { id: x.id, extension: x.extension, hid: x.hid, name: x.name },
                }));
                if (contents.length >= LIMIT) {
                    options.push({ label: "...filter for more", value: null, disabled: true });
                }
                currentOptions.value = options;
            }
        } catch (err) {
            console.debug("[charts] Failed to request datasets.", err);
        } finally {
            loading.value = false;
        }
    } else {
        console.debug("[charts] Data selector disabled, since `datasetId` is unavailable.");
    }
}

loadDatasets();
</script>

<template>
    <div v-if="datasetId">
        <InputSelect
            v-model:value="currentValue"
            :loading="loading"
            :options="currentOptions"
            :optional="optional"
            placeholder="Select a dataset"
            title="Please select a dataset."
            @search="loadDatasets" />
    </div>
    <div v-else>Selection deferred.</div>
</template>
