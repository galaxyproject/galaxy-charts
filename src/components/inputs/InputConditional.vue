<script setup lang="ts">
import { NSelect, NSwitch } from "naive-ui";
import InputForm from "@/components/inputs/InputForm.vue";
import { computed } from "vue";
import { parseValues } from "@/utilities/parsePlugin";
import { InputElementType, InputValuesType } from "@/types";

// Define props with types
const props = defineProps<{
    datasetId: string;
    input: InputElementType;
    value?: InputValuesType;
}>();

// Define emit with event typing
const emit = defineEmits<{
    (event: "update:value", updated: InputValuesType): void;
}>();

if (!props.input.test_param) {
    throw `The conditional '${props.input.name}' is missing a test parameter.`;
}
if (!props.input.cases || props.input.cases.length === 0) {
    throw `The conditional '${props.input.name}' is missing cases.`;
}

// Get test parameter
const testParam = props.input.test_param;

// Get test parameter name and validate it
const testName = testParam.name;
if (!testName) {
    console.error(`[charts] Test parameter has no name: ${props.input.name}.`);
}

// Collect input cases and identify defaults
const caseDefaults = computed(() => {
    const result: Record<string, InputValuesType> = {};
    for (const inputCase of props.input.cases!) {
        result[inputCase.value] = parseValues(inputCase.inputs);
        result[inputCase.value][testName] = inputCase.value;
    }
    return result;
});

// Collect all input cases
const caseInputs = computed(() => {
    const result: Record<string, Array<InputElementType>> = {};
    for (const inputCase of props.input.cases!) {
        result[inputCase.value] = inputCase.inputs;
    }
    return result;
});

// Current test value
const currentTestValue = computed({
    get() {
        return String(props.value?.[testName] ?? testParam.value ?? "");
    },
    set(newVal: string) {
        const base = caseDefaults.value[newVal] || {};
        emit("update:value", { ...base });
    },
});

// Handle conversion of boolean switch values to string for case evaluation
const switchTestValue = computed({
    get() {
        return currentTestValue.value === "true";
    },
    set(newVal: boolean) {
        currentTestValue.value = String(newVal);
    },
});

// Collect current inputs
const currentInputs = computed(() => {
    const inputs = caseInputs.value[currentTestValue.value];
    return inputs || [];
});

// Update values if test value changes or conditional input elements are modified
function onUpdate(newValues: InputValuesType) {
    const updated = { ...props.value, ...newValues, [testName]: currentTestValue.value };
    emit("update:value", updated);
}
</script>

<template>
    <n-switch v-if="testParam.type === 'boolean'" v-model:value="switchTestValue" />
    <n-select v-else v-model:value="currentTestValue" :options="testParam.data" />
    <div v-if="currentInputs.length" class="border border-dotted border-green-600 rounded mt-2 p-2">
        <InputForm :dataset-id="datasetId" :inputs="currentInputs" :values="value" @update:values="onUpdate" />
    </div>
</template>
