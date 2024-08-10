<script setup>
import ViewPort from "@/components/ViewPort.vue";
import ngl from "@/plugins/ngl.vue";
const config = {
    dataset_id: "8a81cf6f989c4467",
    dataset_url: "test-data/1ACB.pdb",
    settings: {
        mode: "contact",
        radius: 0.2,
    },
};
</script>

<template>
    <ViewPort :config="config" xml="xml/ngl.xml">
        <template #default="{ datasetUrl, settings }">
            <ngl :dataset-url="datasetUrl" :settings="settings" />
        </template>
    </ViewPort>
</template>
