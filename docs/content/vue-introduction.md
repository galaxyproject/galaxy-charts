# Vue Component

The `GalaxyCharts` core component is used to embed a JavaScript-based visualization by placing the visualization code within its `#default` slot. This component parses static `config` options and the XML visualization wrapper to render both the viewport and input form.

```vue
<script setup>
import { GalaxyCharts } from "galaxy-charts";

// Configuration of your visualization
const config = {
    dataset_url: "MY_DATASET_URL",
    settings: {},
};

// XML wrapper of your visualization
const xml = "MY_VISUALIZATION.xml";
</script>

<template>
    <GalaxyCharts :config="config" :xml="xml">
        <template #default="{ datasetId, datasetUrl, root, settings, specs, tracks }">
            <!-- Place your plugin code here! -->
        </template>
    </GalaxyCharts>
</template>
```

## Overview of Slot Values

| Variable | Description |
|----------|-------------|
|**datasetId**| The ID of the main dataset to be visualized. Every visualization requires a primary dataset, although additional datasets can be added later if needed.|
|**datasetUrl**| The URL of the dataset to be visualized. The entire dataset may be requested for visualization, or only parts/metadata may be retrieved via the Galaxy API.|
|**root**| The proxy route to the Galaxy server (default is '/').|
|**settings**| Configuration settings specific to the visualization, as declared in the XML wrapper.|
|**specs**| Static specification values defined in the XML wrapper.|
|**tracks**| Track configuration values for the visualization, as specified in the XML wrapper.|