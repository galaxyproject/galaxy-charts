<script setup>
import { ref, watch } from "vue";
import { NInput, NInputNumber, NSelect, NSlider } from "naive-ui";
import InputDataColumn from "@/components/InputDataColumn.vue";
import { toBoolean } from "@/utilities/toBoolean";

const NUMBER_STEP_SIZE = 0.01;

const props = defineProps({
    datasetId: {
        type: String,
        required: true,
    },
    inputs: {
        type: Array,
        default: () => [],
    },
    root: {
        type: String,
        default: "/",
    },
    values: {
        type: Object,
        default: () => {},
    },
});

// create a local copy of the values prop
const currentValues = ref({ ...props.values });

// emit an event when values changes
const emit = defineEmits(["update:values"]);

// trigger update of values
function onUpdate() {
    emit("update:values", currentValues.value);
}

// watch incoming values
watch(
    () => props.values,
    () => {
        currentValues.value = { ...props.values };
    },
);
</script>

<template>
    <div class="overflow-auto select-none">
        <div v-for="(input, inputIndex) in inputs" :key="inputIndex" class="pb-2">
            <div class="font-bold pb-1">{{ input.label || input.name }}</div>
            <div v-if="input.help" class="text-xs pb-1">{{ input.help }}</div>
            <div v-if="input.name in currentValues">
                <div v-if="input.type === 'data_column'">
                    <InputDataColumn
                        v-model:value="currentValues[input.name]"
                        :dataset-id="datasetId"
                        :is-auto="toBoolean(input.is_auto)"
                        :is-label="toBoolean(input.is_label)"
                        :is-numeric="toBoolean(input.is_numeric)"
                        :is-zero="toBoolean(input.is_zero)"
                        :root="root"
                        @update:value="onUpdate()" />
                </div>
                <div v-else-if="input.type === 'float'">
                    <n-slider
                        v-if="input.min !== undefined && input.max !== undefined"
                        class="mb-2"
                        v-model:value="currentValues[input.name]"
                        :min="Number(input.min)"
                        :max="Number(input.max)"
                        :step="NUMBER_STEP_SIZE"
                        @update:value="onUpdate()" />
                    <n-input-number
                        v-model:value="currentValues[input.name]"
                        size="small"
                        :min="Number(input.min)"
                        :max="Number(input.max)"
                        :step="NUMBER_STEP_SIZE"
                        @update:value="onUpdate()" />
                </div>
                <div v-else-if="input.type === 'select'">
                    <n-select
                        v-model:value="currentValues[input.name]"
                        :options="input.data"
                        @update:value="onUpdate()" />
                </div>
                <div v-else>
                    <n-input v-model:value="currentValues[input.name]" @update:value="onUpdate()" />
                </div>
            </div>
        </div>
    </div>
</template>
