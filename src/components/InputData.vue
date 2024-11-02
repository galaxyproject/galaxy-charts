<script setup>
import { ref, watch } from "vue";
import { NSelect } from "naive-ui";
import { GalaxyApi } from "@/api/client";

const LIMIT = 20;

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

async function loadColumns(query) {
    isLoading.value = true;
    try {
        const paramString = query ? `q=name-contains&qv=${query}` : "";
        const { data } = await GalaxyApi().GET(`/api/datasets?limit=${LIMIT}&${paramString}`);
        const options = data.map((x) => ({
            label: `${x.name} (${x.extension})`,
            value: x.id,
        }));
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

loadColumns();

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
        @search="loadColumns" />
</template>
