---
title: Galaxy Charts UI Component
description: The Galaxy Charts UI component embeds JavaScript plugins in Galaxy.
---

The `<GalaxyCharts>` core component is shipped by [Galaxy Charts UI](/galaxy-charts/introduction#galaxy-charts-ui) and serves as a container for embedding JavaScript-based plugins. Plugin code is placed within its `#default` slot. The component automatically retrieves static `data-incoming` options from the `#app` container, provided by Galaxy, to render both the plugin viewport and the input form.

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

| Variable        | Type       | Description                                                                                                                                                                                                                                            |
| --------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **credentials** | String     | (Optional) Specifies whether to include or omit credentials in the request. Acceptable values are "include" or "omit."                                                                                                                                 |
| **incoming**    | Dictionary | (Optional) Use this when parsing incoming data prepared by Galaxy as a property. If not specified, the component will look for data in the `#app` container's `data-incoming` attribute. This incoming data includes details and settings for plugins. |

## Overview of Slot Values

| Variable       | Type       | Description                                                                                                                                                 |
| -------------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **datasetId**  | String     | The ID of the main dataset. The `#default` slot is rendered once a dataset is set, and additional datasets can be added later if needed.                    |
| **datasetUrl** | String     | The URL of the main dataset. The entire dataset may be requested, or only parts/metadata may be retrieved via the Galaxy API.                               |
| **root**       | String     | The route to the Galaxy server (default is `/`).                                                                                                            |
| **save**       | Function   | Call `save({ settings, tracks })` to save settings and tracks. Applies changes by merging with current settings and tracks before saving the visualization. |
| **settings**   | Dictionary | Configuration settings specific to the plugin, as declared in the XML wrapper.                                                                              |
| **specs**      | Dictionary | Static specification values defined in the XML wrapper.                                                                                                     |
| **tracks**     | Array      | Track configuration values for the plugin, as specified in the XML wrapper.                                                                                 |
| **update**     | Function   | Call `update({ settings, tracks })` to update settings and tracks. Applies changes by merging with current settings tracks.                                 |
