<script setup>
import { computed, ref } from "vue";
import { NSelect } from "naive-ui";
import { datasetsGet } from "@/api/datasets";

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
    value: {
        type: String | undefined,
        required: false,
    },
});

// emit an event when adding or removing repeat blocks
const emit = defineEmits([]);
const currentValue = ref(props.value);
const currentOptions = ref([
    {
        label: "test",
        value: "ok",
    },
]);

datasetsGet(props.root, props.datasetId).then((dataset) => {});
</script>

<template>
    <n-select v-model:value="currentValue" :options="currentOptions" />
</template>
