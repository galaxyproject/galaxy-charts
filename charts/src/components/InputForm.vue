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
            <div class="font-bold">{{ input.label || input.name }}</div>
            <div v-if="input.help" class="text-xs py-1">{{ input.help }}</div>
            <div v-if="input.name in currentValues">
                <div v-if="input.type === 'select'">
                    <n-select
                        v-model:value="currentValues[input.name]"
                        :options="input.data"
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
                <div v-else>
                    <n-input v-model:value="currentValues[input.name]" @update:value="onUpdate()" />
                </div>
            </div>
        </div>
    </div>
</template>
