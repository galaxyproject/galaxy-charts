<script setup lang="ts">
import { ref, watch } from "vue";
import { NColorPicker, NInput, NInputNumber, NSelect, NSlider, NSwitch } from "naive-ui";
import InputConditional from "@/components/InputConditional.vue";
import InputData from "@/components/InputData.vue";
import InputDataColumn from "@/components/InputDataColumn.vue";
import { toBoolean } from "@/utilities/toBoolean";
import type { InputElementType, InputValuesType } from "@/types";

const NUMBER_STEP_SIZE = 0.01;

const props = defineProps<{
    datasetId: string;
    inputs: InputElementType[];
    values?: InputValuesType;
}>();

// Define emit
const emit = defineEmits<{
    (event: "update:values", values: InputValuesType): void;
}>();

// Create a local copy of the values prop
const currentValues = ref<InputValuesType>(initialValues());

// Initialize all values to ensure reactivity
function initialValues(): InputValuesType {
    const values = { ...props.values };
    props.inputs.forEach((input) => {
        if (values[input.name] === undefined) {
            values[input.name] = null;
        }
    });
    return values;
}

// Trigger an update of values
function onUpdate(): void {
    emit("update:values", currentValues.value);
}

// Watch for changes in incoming values and reinitialize
watch(
    () => props.values,
    () => {
        currentValues.value = initialValues();
    },
);
</script>

<template>
    <div class="select-none">
        <div
            v-for="(input, inputIndex) in inputs"
            :key="inputIndex"
            :class="inputIndex < inputs.length - 1 ? 'pb-2' : ''">
            <div class="font-bold mb-1">{{ input.label || input.name }}</div>
            <div v-if="input.help" class="text-xs mb-1">{{ input.help }}</div>
            <div>
                <n-switch
                    v-if="input.type === 'boolean'"
                    v-model:value="currentValues[input.name]"
                    @update:value="onUpdate()" />
                <n-color-picker
                    v-else-if="input.type === 'color'"
                    v-model:value="currentValues[input.name]"
                    :modes="['hex']"
                    :show-alpha="false"
                    @update:value="onUpdate()" />
                <InputConditional
                    v-else-if="input.type === 'conditional'"
                    v-model:value="currentValues[input.name]"
                    :dataset-id="datasetId"
                    :input="input"
                    @update:value="onUpdate()" />
                <InputData
                    v-else-if="input.type === 'data'"
                    v-model:value="currentValues[input.name]"
                    :extension="input.extension"
                    :optional="toBoolean(input.optional)"
                    @update:value="onUpdate()" />
                <InputDataColumn
                    v-else-if="input.type === 'data_column'"
                    v-model:value="currentValues[input.name]"
                    :dataset-id="datasetId"
                    :is-auto="toBoolean(input.is_auto)"
                    :is-text="toBoolean(input.is_text)"
                    :is-number="toBoolean(input.is_number)"
                    @update:value="onUpdate()" />
                <div v-else-if="['float', 'integer'].includes(input.type)">
                    <n-slider
                        v-if="input.min !== undefined && input.max !== undefined"
                        class="mb-2"
                        v-model:value="currentValues[input.name]"
                        :min="Number(input.min)"
                        :max="Number(input.max)"
                        :step="input.type === 'float' ? NUMBER_STEP_SIZE : 1"
                        @update:value="onUpdate()" />
                    <n-input-number
                        v-model:value="currentValues[input.name]"
                        size="small"
                        :min="Number(input.min)"
                        :max="Number(input.max)"
                        :step="input.type === 'float' ? NUMBER_STEP_SIZE : 1"
                        @update:value="onUpdate()" />
                </div>
                <n-select
                    v-else-if="input.type === 'select'"
                    v-model:value="currentValues[input.name]"
                    :options="input.data"
                    @update:value="onUpdate()" />
                <n-input
                    v-else-if="input.type === 'textarea'"
                    v-model:value="currentValues[input.name]"
                    :rows="Number(input.rows)"
                    type="textarea"
                    @update:value="onUpdate()" />
                <n-input v-else v-model:value="currentValues[input.name]" @update:value="onUpdate()" />
            </div>
        </div>
    </div>
</template>
