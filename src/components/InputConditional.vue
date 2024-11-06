<script setup lang="ts">
import { NSelect, NSwitch } from "naive-ui";
import InputForm from "@/components/InputForm.vue";
import { computed, ref, watch, defineProps, defineEmits, defineModel } from "vue";
import { parseDefaults } from "@/utilities/parseDefaults";
import { InputElementType, InputValuesType } from "@/types";

// Define props with types
const props = defineProps<{
    datasetId: string;
    input: InputElementType;
}>();

// Define emit with event typing
const emit = defineEmits<{
    (event: "update:value", updatedValues: InputValuesType): void;
}>();

if (!props.input.test_param) {
    throw `The conditional '${props.input.name}' is missing a test parameter.`;
}

if (!props.input.cases || props.input.cases.length === 0) {
    throw `The conditional '${props.input.name}' is missing a cases.`;
}

// Get test parameter
const testParam = ref(props.input.test_param);

// Get test parameter name and validate it
const testName = testParam.value.name;
if (!testName) {
    console.error(`Test parameter has no name: ${props.input.name}.`);
}

// Reference the model value of the conditional component
const currentValue = defineModel<InputValuesType>("value");
if (!currentValue.value || !(testName in currentValue.value)) {
    console.error(`Test parameter of conditional not available: ${props.input.name}.`, currentValue.value);
}

// Reference current test parameter value
const currentTestValue = ref<string>(currentValue.value && currentValue.value[testName]);

// Collect input cases and identify defaults
const caseDefaults = computed(() => {
    const result: Record<string, InputValuesType> = {};
    if (props.input.cases && props.input.cases.length > 0) {
        for (const inputCase of props.input.cases) {
            result[inputCase.value] = parseDefaults(inputCase.inputs);
            result[inputCase.value][testName] = inputCase.value;
        }
    }
    return result;
});

// Collect all input cases
const caseInputs = computed(() => {
    const result: Record<string, Array<InputElementType>> = {};
    if (props.input.cases && props.input.cases.length > 0) {
        for (const inputCase of props.input.cases) {
            result[inputCase.value] = inputCase.inputs;
        }
    }
    return result;
});

// Current inputs based on selected test value
const currentInputs = computed(() => caseInputs.value[currentTestValue.value]);

// Handle conversion of boolean switch values to string for case evaluation
const switchTestValue = computed({
    get() {
        return currentTestValue.value === "true";
    },
    set(newVal: boolean) {
        currentTestValue.value = String(newVal);
    },
});

// Update values if test value changes or conditional input elements are modified
function onUpdate(newValues?: InputValuesType) {
    let updatedValues = { ...caseDefaults.value[currentTestValue.value] };
    if (newValues) {
        const filteredValues: InputValuesType = {};
        currentInputs.value.forEach((x) => {
            filteredValues[x.name] = newValues[x.name];
        });
        updatedValues = { ...updatedValues, ...newValues };
    }
    emit("update:value", updatedValues);
}

// Load defaults if test value changes
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
