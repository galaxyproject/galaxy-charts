<script setup>
import VuePlotly from 'vue-plotly';

const props = defineProps({
    datasetUrl: String,
    settings: Object,
});

const plotData = [{
      x: [1,2,3,4],
      y: [10,15,13,17],
      type:"scatter"
    }];
const layout = {
      title: "My graph"
    };
</script>

<template>
    <VuePlotly :data="plotData" :layout="layout" :display-mode-bar="false" />
</template>
