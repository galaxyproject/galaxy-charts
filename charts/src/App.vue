<script setup>
import ViewPort from "@/components/ViewPort.vue";
import Plotly from "@/plugins/plotly.vue";
const config = {
    dataset_id: "8a81cf6f989c4467",
    dataset_url: "test-data/1ACB.pdb",
    settings: {
        mode: "contact",
        radius: 0.2,
        x_axis_type: {
            type: "f",
            precision: "3",
        },
    },
};
</script>

<template>
    <ViewPort :config="config" xml="xml/plotly.xml">
        <template #default="{ datasetId, datasetUrl, root, settings, tracks }">
            <Plotly
                :dataset-id="datasetId"
                :dataset-url="datasetUrl"
                :root="root"
                :settings="settings"
                :tracks="tracks" />
        </template>
    </ViewPort>
</template>
