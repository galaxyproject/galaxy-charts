<script setup>
import { ref, watch } from "vue";
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
    isText: {
        type: Boolean,
        default: false,
    },
    isNumber: {
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
        const dataset = await datasetsGet(props.datasetId);
        const columns = parseColumns(dataset, props.isAuto, props.isText, props.isNumber);
        currentOptions.value = columns;
        initializeValue();
    } catch (err) {
        console.log(err);
    }
}

function initializeValue() {
    if (currentOptions.value.length > 0 && currentValue.value === null) {
        currentValue.value = currentOptions.value[0].value;
    }
}

loadColumns();

watch(
    () => currentValue.value,
    () => initializeValue(),
);
</script>

<template>
    <n-select v-model:value="currentValue" :options="currentOptions" />
</template>
