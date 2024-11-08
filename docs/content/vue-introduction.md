# Vue Component

The `GalaxyCharts` core component serves as a container for embedding JavaScript-based visualizations. Visualization code is placed within its `#default` slot. The component automatically retrieves static `data-incoming` options from the `#app` container, provided by Galaxy, to render both the visualization viewport and the input form.

```vue
<template>
    <GalaxyCharts>
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