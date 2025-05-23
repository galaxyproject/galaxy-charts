<script setup lang="ts">
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NButton, NIcon } from "naive-ui";
import InputForm from "@/components/InputForm.vue";
import { computed } from "vue";
import { parseValues } from "@/utilities/parsePlugin";
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
    newValuesArray.unshift(defaultValues.value);
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
    <div v-for="(values, index) of valuesArray" :key="index" class="py-2">
        <div class="border border-dotted border-green-600 rounded p-2">
            <InputForm
                :dataset-id="datasetId"
                :inputs="inputs"
                :values="values"
                @update:values="onUpdate(index, $event)" />
            <n-button
                class="w-full mt-2"
                data-description="remove repeat block"
                :disabled="valuesArray.length <= 1"
                size="tiny"
                type="primary"
                @click="onRemove(index)">
                <n-icon><TrashIcon /></n-icon>
                <span class="mx-1">Remove Track {{ valuesArray.length - index }}</span>
            </n-button>
        </div>
    </div>
</template>
