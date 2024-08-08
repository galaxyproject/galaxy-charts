<script setup>
import { ref, watch } from "vue";
import { NInput, NInputNumber, NSelect, NSlider } from "naive-ui";

const NUMBER_STEP_SIZE = 0.01;

const props = defineProps({
    inputs: {
        type: Array,
        default: () => [],
    },
    values: {
        type: Object,
        default: () => {},
    },
});

// Create a local copy of the values prop
const currentValues = ref({ ...props.values });

// Emit an event when currentValues changes
const emit = defineEmits(["update:values"]);

// Watch and update values
watch(
    currentValues,
    (newValues) => {
        emit("update:values", newValues);
    },
    { deep: true },
);
</script>

<template>
    <div class="overflow-auto select-none">
        <div v-for="input in inputs" class="pb-2">
            <div class="font-bold">{{ input.label || input.name }}</div>
            <div v-if="input.help" class="text-xs py-1">{{ input.help }}</div>
            <div v-if="input.name in currentValues">
                <div v-if="input.type === 'select'">
                    <n-select v-model:value="currentValues[input.name]" :options="input.data" />
                </div>
                <div v-else-if="input.type === 'float'">
                    <n-slider
                        v-if="input.min !== undefined && input.max !== undefined"
                        class="mb-2"
                        v-model:value="currentValues[input.name]"
                        :min="Number(input.min)"
                        :max="Number(input.max)"
                        :step="NUMBER_STEP_SIZE" />
                    <n-input-number
                        v-model:value="currentValues[input.name]"
                        size="small"
                        :min="Number(input.min)"
                        :max="Number(input.max)"
                        :step="NUMBER_STEP_SIZE" />
                </div>
                <div v-else>
                    <n-input v-model:value="currentValues[input.name]" />
                </div>
            </div>
        </div>
    </div>
</template>
