<script setup>
import { NSelect } from "naive-ui";
import InputForm from "@/components/InputForm.vue";
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
if (!testName) {
    console.error(`Test parameter has no name: ${props.input.name}.`);
}

// reference current test and conditional values
const currentValue = defineModel("value");
if (!currentValue.value || !(testName in currentValue.value)) {
    console.error(`Test parameter of conditional not available: ${props.input.name}.`, currentValue.value);
}

// reference current test parameter value
const currentTestValue = ref(currentValue.value[testName]);

// collect input cases and identify defaults
const inputCases = {};
const inputDefaults = {};
for (const inputCase of props.input.cases) {
    inputCases[inputCase.value] = inputCase.inputs;
    inputDefaults[inputCase.value] = parseDefaults(inputCase.inputs);
    inputDefaults[inputCase.value][testName] = inputCase.value;
}

// update values if test value changes or conditional input elements are modified
function onUpdate(newValues) {
    currentValue.value = { ...inputDefaults[currentTestValue.value] };
    if (newValues) {
        currentValue.value = { ...currentValue.value, ...newValues };
    }
}

// load defaults if test value changes
watch(
    () => currentTestValue.value,
    () => {
        onUpdate();
    },
);
</script>

<template>
    <n-select v-model:value="currentTestValue" :options="input.test_param.data" />
    <div v-if="inputCases[currentTestValue]" class="border border-dotted border-green-600 rounded mt-2 p-2">
        <InputForm
            :dataset-id="datasetId"
            :inputs="inputCases[currentTestValue]"
            :root="root"
            :values="currentValue"
            @update:values="onUpdate" />
    </div>
</template>
