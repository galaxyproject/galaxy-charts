<script setup>
import { ref } from "vue";
import { NSelect } from "naive-ui";
import { GalaxyApi } from "@/api/client";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { NIcon } from "naive-ui";

const LIMIT = 100;

const props = defineProps({
    extension: {
        type: String,
        default: "",
    },
    optional: {
        type: Boolean,
        default: false,
    },
});

// emit an event when adding or removing repeat blocks
const currentOptions = ref([]);
const currentValue = defineModel("value");
const isLoading = ref(false);
const selectValue = ref(null);

async function loadDatasets(query) {
    isLoading.value = true;
    try {
        const extensionFilter = props.extension ? `q=extension-eq&qv=${props.extension}` : "";
        const nameFilter = query ? `q=name-contains&qv=${query}` : "";
        const { data } = await GalaxyApi().GET(`/api/datasets?limit=${LIMIT}&${extensionFilter}&${nameFilter}`);
        const options = data.map((x) => ({
            label: x.name,
            value: x,
        }));
        options.push({ label: "...filter for more", value: null, disabled: true });
        if (props.optional) {
            options.unshift({ label: "-- Clear Selection --", value: null });
        }
        currentOptions.value = options;
        isLoading.value = false;
    } catch (err) {
        console.log(err);
    }
}

function onUpdate() {
    currentValue.value = selectValue.value;
    selectValue.value = null;
}

loadDatasets();
</script>

<template>
    <div v-if="currentValue" class="mb-1">
        <n-icon class="size-3 mr-1"><CheckCircleIcon /></n-icon>
        <span>Selected: {{ currentValue.name }}</span>
    </div>
    <div v-else-if="!optional" class="text-red-600 mb-1">
        <n-icon class="size-3 mr-1"><ExclamationCircleIcon /></n-icon>
        <span>Please select a dataset.</span>
    </div>
    <n-select
        v-model:value="selectValue"
        filterable
        placeholder="Select a Dataset"
        :loading="isLoading"
        :options="currentOptions"
        @search="loadDatasets"
        @update:value="onUpdate" />
</template>
