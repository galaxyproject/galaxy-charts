<script setup lang="ts">
import { ref } from "vue";
import { GalaxyApi } from "@/api/client";
import { useDatasetStore } from "@/store/datasetStore";
import InputSelect from "@/components/InputSelect.vue";
import type { InputSelectOptionType } from "@/types";

const { getDataset } = useDatasetStore();

const LIMIT = 100;

type ValueType = {
    id: string;
    hid: string;
    name: string;
};

const props = defineProps<{
    datasetId?: string;
    extension?: string;
    optional?: boolean;
}>();

const currentOptions = ref<Array<InputSelectOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadDatasets(query?: string): Promise<void> {
    if (props.datasetId) {
        loading.value = true;
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
                if (data.length >= LIMIT) {
                    options.push({ label: "...filter for more", value: null, disabled: true });
                }
                currentOptions.value = options;
            }
        } catch (err) {
            console.log(err);
        } finally {
            loading.value = false;
        }
    } else {
        console.debug("Data selector disabled, since `datasetId` is unavailable.");
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
