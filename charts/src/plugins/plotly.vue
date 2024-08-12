<script setup>
import Plotly from "plotly.js-dist";
import { onMounted, ref } from "vue";

const props = defineProps({
    datasetUrl: String,
    settings: Object,
});

const viewport = ref(null);
const plotData = [
    {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: "scatter",
    },
];
const layout = {
    title: "My graph",
};

var config = { responsive: false };

onMounted(() => {
    //Plotly.newPlot(viewport.value, [{ y: [1, 2, 3] }])
    var data = [
        {
            z: [
                [1, 20, 30],
                [20, 1, 60],
                [30, 60, 1],
            ],
            type: "heatmap",
        },
    ];

    Plotly.newPlot(viewport.value, data, layout, config);
});
</script>

<template>
    <div ref="viewport" />
</template>
