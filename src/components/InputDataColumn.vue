<script setup>
import { ref, watch } from "vue";
import { NSelect } from "naive-ui";
import { parseColumns } from "@/utilities/parseColumns";
import { GalaxyApi } from "@/api/client";

const props = defineProps({
    datasetId: {
        type: String,
        default: "",
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
    if (props.datasetId) {
        try {
            const { data: dataset } = await GalaxyApi().GET(`/api/datasets/${props.datasetId}`);
            const columns = parseColumns(dataset, props.isAuto, props.isText, props.isNumber);
            currentOptions.value = columns;
            initializeValue();
        } catch (err) {
            console.log(err);
        }
    } else {
        console.log("Data column input disabled, since `datasetId` is unavailable.");
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
