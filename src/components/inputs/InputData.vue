<script setup lang="ts">
import { ref } from "vue";
import { getOptions, HISTORY_LIMIT } from "@/galaxy";
import InputSelect from "@/components/inputs/InputSelect.vue";
import type { OptionInputType } from "@/schema/inputOptions";
import type { InputOptionType } from "@/types";

type ValueType = {
    id: string;
    extension: string;
    hid: string;
    name: string;
};

const props = defineProps<{
    datasetId?: string;
    input: OptionInputType;
    optional?: boolean;
}>();

const currentOptions = ref<Array<InputOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadDatasets(query?: string): Promise<void> {
    if (props.datasetId) {
        loading.value = true;
        try {
            const options = await getOptions(props.input, { datasetId: props.datasetId, query });
            if (options.length > 0) {
                if (options.length >= HISTORY_LIMIT) {
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
