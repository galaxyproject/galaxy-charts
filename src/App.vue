<script setup>
import { ViewPort } from "galaxy-charts";
import Plugin from "@/Plugin.vue";
const config = {
    dataset_url: "galaxy-charts.txt",
    settings: {
        setting_text: "My Test Setting",
        setting_boolean: true,
    },
};
</script>

<template>
    <ViewPort :config="config" xml="galaxy-charts.xml">
        <template #default="{ datasetId, datasetUrl, root, settings, specs, tracks }">
            <Plugin
                :dataset-id="datasetId"
                :dataset-url="datasetUrl"
                :root="root"
                :settings="settings"
                :specs="specs"
                :tracks="tracks" />
        </template>
    </ViewPort>
</template>
