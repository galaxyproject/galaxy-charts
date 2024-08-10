<script setup>
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NButton, NIcon } from "naive-ui";
import InputForm from "./InputForm.vue";
import { computed } from "vue";

const props = defineProps({
    datasetId: {
        type: String,
        required: true,
    },
    inputs: {
        type: Array,
        required: true,
    },
    root: {
        type: String,
        default: "/",
    },
    valuesArray: {
        type: Array,
        required: true,
    },
});

// emit an event when adding or removing repeat blocks
const emit = defineEmits(["update:values-array"]);

// collect default values to populate new repeat blocks
const defaultValues = computed(() => {
    let dv = {};
    props.inputs.forEach((input) => (dv[input.name] = input.value));
    return dv;
});

// add a new repeat block
function onAdd() {
    const newValuesArray = [...props.valuesArray];
    newValuesArray.push(defaultValues.value);
    emit("update:values-array", newValuesArray);
}

// remove a repeat block
function onRemove(index) {
    const newValuesArray = [...props.valuesArray];
    newValuesArray.splice(index, 1);
    emit("update:values-array", newValuesArray);
}

// update a repeat block
function onUpdate(index, values) {
    const newValuesArray = [...props.valuesArray];
    newValuesArray[index] = { ...values };
    emit("update:values-array", newValuesArray);
}
</script>

<template>
    <n-button size="tiny" type="primary" class="mb-2" @click="onAdd">
        <n-icon><PlusIcon /></n-icon>
        <span class="mx-1">Add New Track</span>
    </n-button>
    <div v-for="(values, index) of valuesArray" :key="index" class="my-2">
        <div class="border border-dotted border-green-600 rounded p-2">
            <InputForm
                :dataset-id="datasetId"
                :inputs="inputs"
                :values="values"
                @update:values="onUpdate(index, $event)" />
            <div class="flex text-green-600 my-1">
                <n-button
                    class="text-green-600 w-full"
                    size="tiny"
                    round
                    :disabled="valuesArray.length <= 1"
                    @click="onRemove(index)">
                    <n-icon><TrashIcon /></n-icon>
                    <span class="mx-1">Remove Track {{ valuesArray.length - index }}</span>
                </n-button>
            </div>
        </div>
    </div>
</template>
