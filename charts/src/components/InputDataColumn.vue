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

async function getColumns() {
    try {
        const dataset = await datasetsGet(props.root, props.datasetId);
        var columns = [];
        if (props.isAuto) {
            columns.push({ label: "Column: Row Number", value: "auto" });
        }
        if (props.isZero) {
            columns.push({ label: "Column: None", value: "zero" });
        }
        var meta = dataset.metadata_column_types;
        for (var key in meta) {
            if ((["int", "float"].indexOf(meta[key]) != -1 && props.isNumeric) || props.isLabel) {
                columns.push({ label: "Column: " + (parseInt(key) + 1), value: key });
            }
        }
        currentOptions.value = columns;
        if (columns.length > 0) {
            currentValue.value = columns[0].value;
        }
    } catch (err) {
        console.log(err);
    }
}

getColumns();
</script>

<template>
    <n-select v-model:value="currentValue" :options="currentOptions" />
</template>
