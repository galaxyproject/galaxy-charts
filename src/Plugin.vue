<script setup lang="ts">
import { onMounted, ref, watch } from "vue";

const props = defineProps<{
    datasetId: string;
    datasetUrl: string;
    root: string;
    settings: object;
    specs: object;
    tracks: Array<object>;
}>();

const viewport = ref(null);

function render() {
    /** Place your render function here! */
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
        <div class="bg-gray-600 text-white rounded-lg p-2">
            <pre class="p-2">Settings: {{ settings }}</pre>
            <pre class="p-2">Tracks: {{ tracks }}</pre>
        </div>
    </div>
</template>
