<script setup>
import { ref } from "vue";
import { NSelect } from "naive-ui";
import { datasetsGet } from "@/api/datasets";
import { parseColumns } from "@/utilities/parseColumns";

const props = defineProps({
    datasetId: {
        type: String,
        required: true,
    },
    isAuto: {
        type: Boolean,
        default: false,
    },
    isLabel: {
        type: Boolean,
        default: false,
    },
    isNumeric: {
        type: Boolean,
        default: false,
    },
    isZero: {
        type: Boolean,
        default: false,
    },
    root: {
        type: String,
        default: "/",
    },
});

// emit an event when adding or removing repeat blocks
const currentOptions = ref([]);
const currentValue = defineModel("value");

async function loadColumns() {
    try {
        const dataset = await datasetsGet(props.root, props.datasetId);
        const columns = parseColumns(dataset, props.isAuto, props.isLabel, props.isNumeric, props.isZero);
        currentOptions.value = columns;
        if (columns.length > 0 && currentValue.value === undefined) {
            currentValue.value = columns[0].value;
        }
    } catch (err) {
        console.log(err);
    }
}

loadColumns();
</script>

<template>
    <n-select v-model:value="currentValue" :options="currentOptions" />
</template>
