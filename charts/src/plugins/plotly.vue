<script setup>
import Plotly from "plotly.js-dist";
import { onMounted, ref, watch } from "vue";
import { datasetColumns } from "@/api/datasets";

const props = defineProps({
    datasetId: String,
    datasetUrl: String,
    root: String,
    settings: Object,
    tracks: Array,
});

const viewport = ref(null);

function getColumns(tracks, keys) {
    const columnsList = [];
    for (const track of tracks) {
        for (const column of keys) {
            if (![...columnsList, "auto", "zero"].includes(track[column])) {
                columnsList.push(parseInt(track[column]));
            }
        }
    }
    return columnsList;
}

function render() {
    const layout = {};
    const config = { responsive: true };
    const columnsList = getColumns(props.tracks, ["x", "y"]);
    console.log(columnsList);
    datasetColumns(props.root, props.datasetId, columnsList).then((columns) => {
        const plotData = [
            {
                x: columns[0],
                y: columns[1],
            },
        ];
        Plotly.newPlot(viewport.value, plotData, layout, config);
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
    <div ref="viewport" />
</template>
