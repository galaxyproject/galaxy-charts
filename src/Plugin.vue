<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import type { InputValuesType } from "galaxy-charts";

const props = defineProps<{
    datasetId: string;
    datasetUrl: string;
    root: string;
    settings: InputValuesType;
    specs: Record<string, string>;
    tracks: Array<InputValuesType>;
}>();

// Emit events with TypeScript
const emit = defineEmits<{
    (event: "save", newSettings: InputValuesType): void;
}>();

const viewport = ref(null);

function render() {
    /** Place your render function here! */
}

function onSave() {
    emit("save", {
        job_id: "xyz",
        setting_boolean: true,
        setting_conditional: { test_condition: "true", case_true: "set to new value" },
    });
}

onMounted(() => {
    render();
});

watch(
    () => props,
    () => render(),
    { deep: true },
);
</script>

<template>
    <div ref="viewport" class="h-screen p-4 overflow-auto">
        <button @click="onSave">onSave</button>
        <div class="bg-gray-600 text-white rounded-lg p-2">
            <pre class="p-2">Settings: {{ settings }}</pre>
            <pre class="p-2">Tracks: {{ tracks }}</pre>
        </div>
    </div>
</template>
