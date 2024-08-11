<script setup>
import { NSelect } from "naive-ui";
import InputForm from "./InputForm.vue";
import { ref, watch } from "vue";
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

// get test parameter name
const testName = props.input.test_param.name;

// reference current test and conditional values
const currentValue = defineModel("value");
const currentTestValue = ref(currentValue.value[testName]);

// collect input cases and identify defaults
const inputCases = {};
const inputDefaults = {};
for (const inputCase of props.input.cases) {
    inputCases[inputCase.value] = inputCase.inputs;
    inputDefaults[inputCase.value] = parseDefaults(inputCase.inputs);
    inputDefaults[inputCase.value][testName] = inputCase.value;
}

// load defaults if test value changes
watch(
    () => currentTestValue.value,
    () => {
        currentValue.value = { ...inputDefaults[currentTestValue.value] };
    },
);
</script>

<template>
    <n-select v-model:value="currentTestValue" :options="input.test_param.data" />
    <div v-if="inputCases[currentTestValue]" class="border border-dotted border-green-600 rounded mt-2 p-2">
        <InputForm :dataset-id="datasetId" :inputs="inputCases[currentTestValue]" :root="root" :values="currentValue" />
    </div>
</template>
