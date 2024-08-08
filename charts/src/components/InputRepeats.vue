<script setup>
import { PlusCircleIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NButton, NIcon } from "naive-ui";
import InputForm from "./InputForm.vue";
const props = defineProps({
    inputs: {
        type: Array,
        required: true,
    },
    valuesArray: {
        type: Array,
        required: true,
    },
});

// emit an event when adding or removing repeat blocks
const emit = defineEmits(["update:values-array"]);

function onAdd() {
    let defaultValues = {};
    props.inputs.forEach((input) => (defaultValues[input.name] = input.value));
    const newValuesArray = [...props.valuesArray];
    newValuesArray.push(defaultValues);
    emit("update:values-array", newValuesArray);
}

function onRemove(index) {
    const newValuesArray = [...props.valuesArray];
    newValuesArray.splice(index, 1);
    emit("update:values-array", newValuesArray);
}
</script>

<template>
    <n-button size="tiny" type="primary" class="mb-2" @click="onAdd">
        <n-icon><PlusCircleIcon /></n-icon>
        <span class="mx-1">Add New Track</span>
    </n-button>
    <div v-for="(values, index) of valuesArray" :key="index" class="my-2">
        <div class="border border-dotted border-green-600 rounded p-2">
            <InputForm :inputs="inputs" :values="values" />
            <div class="flex text-green-600 my-1">
                <n-button
                    class="text-green-600 w-full"
                    size="tiny"
                    round
                    :disabled="valuesArray.length <= 1"
                    @click="onRemove(index)">
                    <n-icon><TrashIcon /></n-icon>
                    <span class="mx-1">Remove Track {{ index + 1 }}</span>
                </n-button>
            </div>
        </div>
    </div>
</template>
