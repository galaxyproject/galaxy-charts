<script setup>
import { ref, watch } from "vue";
import { NSelect } from "naive-ui";
import { GalaxyApi } from "@/api/client";

const LIMIT = 100;

const props = defineProps({
    extension: {
        type: String,
        default: "",
    },
});

// emit an event when adding or removing repeat blocks
const currentOptions = ref([]);
const currentValue = defineModel("value");
const isLoading = ref(false);

async function loadDatasets(query) {
    isLoading.value = true;
    try {
        const extensionFilter = props.extension ? `q=extension-eq&qv=${props.extension}` : "";
        const nameFilter = query ? `q=name-contains&qv=${query}` : "";
        const { data } = await GalaxyApi().GET(`/api/datasets?limit=${LIMIT}&${extensionFilter}&${nameFilter}`);
        const options = data.map((x) => ({
            label: `${x.name} (${x.extension})`,
            value: x.id,
        }));
        options.push({ label: "...filter for more", value: null, disabled: true });
        currentOptions.value = options;
        isLoading.value = false;
        initializeValue();
    } catch (err) {
        console.log(err);
    }
}

function initializeValue() {
    if (currentOptions.value.length > 0 && currentValue.value === null) {
        currentValue.value = currentOptions.value[0].value;
    }
}

loadDatasets();

watch(
    () => currentValue.value,
    () => initializeValue(),
);
</script>

<template>
    <n-select
        v-model:value="currentValue"
        :loading="isLoading"
        :options="currentOptions"
        filterable
        placeholder="Select a Dataset"
        @search="loadDatasets" />
</template>
