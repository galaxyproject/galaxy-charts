<script setup lang="ts">
import { GalaxyCharts } from "galaxy-charts";
import Plugin from "./Plugin.vue";

defineProps<{
    credentials?: RequestCredentials;
    xml: string;
}>();
</script>

<template>
    <GalaxyCharts :credentials="credentials" :xml="xml">
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
