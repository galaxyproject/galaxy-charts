<script setup>
import { GalaxyCharts, useConfigStore } from "galaxy-charts";
import Plugin from "@/Plugin.vue";

if (process.env.credentials) {
    const configStore = useConfigStore();
    configStore.setCredentials(process.env.credentials);
}

const config = {
    dataset_url: null,
    dataset_id: "unavailable",
    settings: {
        setting_text: "My Test Setting",
        setting_boolean: true,
    },
};
</script>

<template>
    <GalaxyCharts :config="config" xml="galaxy-charts.xml">
        <template #default="{ datasetId, datasetUrl, root, settings, specs, tracks }">
            <Plugin
                :dataset-id="datasetId"
                :dataset-url="datasetUrl"
                :root="root"
                :settings="settings"
                :specs="specs"
                :tracks="tracks" />
        </template>
    </GalaxyCharts>
</template>
