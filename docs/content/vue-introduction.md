# Vue Component

The `GalaxyCharts` core component serves as a container for embedding JavaScript-based visualizations. Visualization code is placed within its `#default` slot. The component automatically retrieves static `data-incoming` options from the `#app` container, provided by Galaxy, to render both the visualization viewport and the input form.

```vue
<template>
    <GalaxyCharts :credentials="credentials" :incoming="incoming">
        <template #default="{ datasetId, datasetUrl, root, save, settings, specs, tracks, update }">
            <!-- Place your plugin code here! -->
        </template>
    </GalaxyCharts>
</template>
```

## Overview of Props
| Variable | Description |
|----------|-------------|
|**credentials**| (Optional) Specifies whether to include or omit credentials in the request. Acceptable values are "include" or "omit." 
|**incoming**| (Optional) Use this when parsing incoming data prepared by Galaxy as a property. If not specified, the component will look for data in the `#app` container's `data-incoming` attribute. This incoming data includes details and settings for visualization plugins.

## Overview of Slot Values

| Variable | Type | Description |
|----------|------|-------------|
|**datasetId**| String | The ID of the main dataset to be visualized. Every visualization requires a primary dataset, although additional datasets can be added later if needed.|
|**datasetUrl**| String | The URL of the dataset to be visualized. The entire dataset may be requested for visualization, or only parts/metadata may be retrieved via the Galaxy API.|
|**root**| String | The proxy route to the Galaxy server (default is `/`).|
|**save**| Function | Call `save(settings = {})` to save settings. Applies changes by merging with current settings.|
|**settings**| Dictionary | Configuration settings specific to the visualization, as declared in the XML wrapper.|
|**specs**| Dictionary | Static specification values defined in the XML wrapper.|
|**tracks**| Array | Track configuration values for the visualization, as specified in the XML wrapper.|
|**update**| Function | Call `update(settings = {})` to update settings. Applies changes by merging with current settings.|