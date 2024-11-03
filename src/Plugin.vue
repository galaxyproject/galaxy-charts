<script setup>
import { onMounted, ref, watch } from "vue";

const props = defineProps({
    datasetId: String,
    datasetUrl: String,
    root: String,
    settings: Object,
    specs: Object,
    tracks: Array,
});

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
