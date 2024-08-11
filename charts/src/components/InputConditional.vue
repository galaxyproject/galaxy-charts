<script setup>
import { PlusIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { NButton, NIcon, NSelect } from "naive-ui";
import InputForm from "./InputForm.vue";
import { computed, ref } from "vue";

const props = defineProps({
    datasetId: {
        type: String,
        required: true,
    },
    input: {
        type: Object,
        required: true,
    },
    root: {
        type: String,
        required: true,
    },
});

const currentValue = ref(props.input.test_param.value);
const values = ref({});
function onUpdate() {}
</script>

<template>
    <n-select v-model:value="currentValue" :options="input.test_param.data" @update:value="onUpdate()" />
    <div v-for="inputCase of input.cases">
        <div
            v-if="inputCase.inputs && inputCase.value === currentValue"
            class="border border-dotted border-green-600 rounded mt-2 p-2">
            <InputForm :dataset-id="datasetId" :inputs="inputCase.inputs" :root="root" :values="values" />
        </div>
    </div>
</template>
