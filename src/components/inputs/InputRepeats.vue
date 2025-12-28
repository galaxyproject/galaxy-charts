<script setup lang="ts">
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NButton, NIcon } from "naive-ui";
import InputForm from "@/components/inputs/InputForm.vue";
import { computed } from "vue";
import { parseValues } from "@/utilities/parsePlugin";
import { toOrdinal } from "@/utilities/toOrdinal";
import { InputElementType, InputValuesType } from "@/types";

const props = defineProps<{
    datasetId: string;
    inputs: InputElementType[];
    valuesArray: InputValuesType[];
}>();

// Define emit with TypeScript
const emit = defineEmits<{
    (event: "update:values-array", newValuesArray: InputValuesType[]): void;
}>();

// Collect default values to populate new repeat blocks
const defaultValues = computed(() => parseValues(props.inputs));

// Add a new repeat block
function onAdd(): void {
    const newValuesArray = [...props.valuesArray];
    newValuesArray.push(defaultValues.value);
    emit("update:values-array", newValuesArray);
}

// Remove a repeat block
function onRemove(index: number): void {
    const newValuesArray = [...props.valuesArray];
    newValuesArray.splice(index, 1);
    emit("update:values-array", newValuesArray);
}

// Update a repeat block
function onUpdate(index: number, values: InputValuesType): void {
    const newValuesArray = [...props.valuesArray];
    newValuesArray[index] = { ...values };
    emit("update:values-array", newValuesArray);
}
</script>

<template>
    <n-button size="tiny" type="primary" @click="onAdd">
        <n-icon><PlusIcon /></n-icon>
        <span class="mx-1">Add New Track</span>
    </n-button>
    <div
        v-for="(values, index) in [...valuesArray].slice().reverse()"
        :key="valuesArray.length - 1 - index"
        class="py-2">
        <div class="border border-dotted border-green-600 rounded p-2">
            <div v-if="valuesArray.length > 1" class="mb-2">
                <n-button
                    block
                    data-description="remove repeat block"
                    size="tiny"
                    type="error"
                    @click="onRemove(valuesArray.length - 1 - index)">
                    <n-icon><TrashIcon /></n-icon>
                    <span class="mx-1">Remove {{ toOrdinal(valuesArray.length - index) }} Track</span>
                </n-button>
            </div>
            <InputForm
                :dataset-id="datasetId"
                :inputs="inputs"
                :values="values"
                @update:values="onUpdate(valuesArray.length - 1 - index, $event)" />
        </div>
    </div>
</template>
