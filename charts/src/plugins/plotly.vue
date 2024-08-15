<script setup>
import Plotly from "plotly.js-dist";
import { onMounted, ref, watch } from "vue";
import { useColumnsStore } from "@/store/columnsStore";

const props = defineProps({
    datasetId: String,
    datasetUrl: String,
    root: String,
    settings: Object,
    specs: Object,
    tracks: Array,
});

const viewport = ref(null);
const columnsStore = useColumnsStore();

async function render() {
    const layout = {};
    const config = { responsive: true };
    const columnsList = await columnsStore.fetchColumns(props.root, props.datasetId, props.tracks, ["x", "y"]);
    const plotData = [];
    columnsList.forEach((columns) => {
        plotData.push({
            x: columns.x,
            y: columns.y,
            type: props.specs?.type,
        });
    });
    Plotly.newPlot(viewport.value, plotData, layout, config);
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
    <div ref="viewport" class="h-screen" />
</template>
