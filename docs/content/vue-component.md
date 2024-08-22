# Component Usage

The Galaxy Charts core component is used to wrap a JavaScript-based Visualization by placing the visualization code into its `#default` slots. The component will parse static `config` options and the Visualization XML to render a viewport and the input form.

```vue
<script setup>
import { GalaxyCharts } from "galaxy-charts";

// Capable to parse settings directly
const config = {
    dataset_url: "galaxy-charts.txt",
    settings: {
        setting_text: "My Test Setting",
        setting_boolean: true,
    },
};
</script>

<template>
    <GalaxyCharts :config="config" xml="galaxy-charts.xml">
        <template #default="{ datasetId, datasetUrl, root, settings, specs, tracks }">
            // Place your plugin code here!
        </template>
    </GalaxyCharts>
</template>

```
