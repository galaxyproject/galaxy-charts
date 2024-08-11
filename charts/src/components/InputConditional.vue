<script setup>
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NButton, NIcon, NSelect } from "naive-ui";
import InputForm from "./InputForm.vue";
import { computed, ref } from "vue";
import { parseDefaults } from "@/utilities/parseDefaults";

const props = defineProps({
    datasetId: {
        type: String,
        required: true,
    },
    input: {
        type: Object,
        required: true,
    },
    root: {
        type: String,
        required: true,
    },
});

const currentValue = defineModel("value");
const currentTestValue = ref(currentValue.value[props.input.test_param.name]);

// collect input cases and identify defaults
const inputCases = {};
const inputDefaults = {};
for (const inputCase of props.input.cases) {
    inputCases[inputCase.value] = inputCase.inputs;
    inputDefaults[inputCase.value] = parseDefaults(inputCase.inputs);
}

const currentCaseValues = ref({ ...inputDefaults[currentValue.value] });

function onUpdate() {}
</script>

<template>
    <n-select v-model:value="currentTestValue" :options="input.test_param.data" @update:value="onUpdate()" />
    <div v-if="inputCases[currentTestValue]" class="border border-dotted border-green-600 rounded mt-2 p-2">
        <InputForm :dataset-id="datasetId" :inputs="inputCases[currentTestValue]" :root="root" :values="currentValue" />
    </div>
</template>
