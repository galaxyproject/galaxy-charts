<script setup>
import { NSelect, NSwitch } from "naive-ui";
import InputForm from "@/components/InputForm.vue";
import { computed, ref, watch } from "vue";
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
});

// emit an event when adding or removing repeat blocks
const emit = defineEmits(["update:value"]);

// get test parameter
const testParam = ref(props.input.test_param);

// get test parameter name
const testName = testParam.value.name;
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
const caseDefaults = computed(() => {
    const result = {};
    for (const inputCase of props.input.cases) {
        result[inputCase.value] = parseDefaults(inputCase.inputs);
        result[inputCase.value][testName] = inputCase.value;
    }
    return result;
});

// collect all input cases
const caseInputs = computed(() => {
    const result = {};
    for (const inputCase of props.input.cases) {
        result[inputCase.value] = inputCase.inputs;
    }
    return result;
});

const currentInputs = computed(() => caseInputs.value[currentTestValue.value]);

// handle conversion of boolean switch values to string for case evaluation
const switchTestValue = computed({
    get() {
        return currentTestValue.value === "true";
    },
    set(newVal) {
        currentTestValue.value = String(newVal);
    },
});

// update values if test value changes or conditional input elements are modified
function onUpdate(newValues) {
    let updatedValues = { ...caseDefaults.value[currentTestValue.value] };
    if (newValues) {
        const filteredValues = {};
        currentInputs.value.forEach((x) => {
            filteredValues[x.name] = newValues[x.name];
        });
        updatedValues = { ...updatedValues, ...newValues };
    }
    emit("update:value", updatedValues);
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
    <n-switch v-if="testParam.type === 'boolean'" v-model:value="switchTestValue" />
    <n-select v-else v-model:value="currentTestValue" :options="testParam.data" />
    <div v-if="currentInputs" class="border border-dotted border-green-600 rounded mt-2 p-2">
        <InputForm :dataset-id="datasetId" :inputs="currentInputs" :values="currentValue" @update:values="onUpdate" />
    </div>
</template>
