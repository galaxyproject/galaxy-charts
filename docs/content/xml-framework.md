# Understanding Galaxy's Visualization Framework

Let's break down the XML structure and examine how Galaxy processes it to understand the Galaxy visualization framework. This will highlight the full capabilities of the framework, which can support any JavaScript-based plugin, not just Vue-based ones.

Galaxy expects the XML file to reside in the `config` subdirectory of the visualization plugin. This file should be accessible from the Galaxy root directory at `config/plugins/visualizations/MY_VISUALIZATION/config/MY_VISUALIZATION.xml`.

On startup, Galaxy validates the XML file and adds the visualization to the list available in the activity bar. It also scans the XML for a `requirements` tag. When detected, Galaxy installs the specified npm packages and copies all files from each package’s `static` directory to `config/plugins/visualizations/MY_VISUALIZATION/static`.

This completes the installation of the visualization in Galaxy.

## Selection and Dataset Assignment

When a user selects a visualization in the Galaxy interface, Galaxy requires a dataset to be assigned to it. It will either select a dataset from the user's history, or prompt the user to choose a compatible dataset. For information on specifying compatible data types, see the `data_sources` XML section in [Data Sources](xml-datasources).

## Initialization Process

Once the visualization and dataset are selected, Galaxy reads the `entry_point` section in the XML:

```xml
<entry_point entry_point_type="script" src="dist/index.js" css="dist/index.css" container="app" />
```

The entry_point section includes the following parameters:

| Variable | Description |
|----------|-------------|
| **entry_point_type** | Specifies the type of entry point. Galaxy supports two types: mako and script. For JavaScript-based visualizations, this should always be set to script. |
| **src** | The path to the JavaScript bundle within the visualization’s static directory. |
| **css** | (Optional) The path to a CSS file within the visualization’s static directory. |
| **container** | The DOM container ID that the visualization will use (default is "app"). |

## Populating the Script Template

Galaxy Charts leverages Galaxy’s minimal JavaScript-based visualization interface, which can be used independently of Galaxy Charts and is compatible with any JavaScript framework. To understand this framework, let’s examine the interface:

```html
<html>
    <head>
        <link rel="stylesheet" href="{{ entry_point.css }}" />
        <script src="{{ entry_point.src }}"></script>
    </head>
    <body>
        <div id="{{ entry_point.container }}" data-incoming="{{ DATA_FROM_GALAXY }}"></div>
    </body>
</html>
```

In this template, Galaxy populates the css, src, and container attributes with static values from the visualization XML. The data-incoming attribute is dynamically populated by Galaxy with details such as the dataset ID, settings, and visualization plugin metadata.

## Minimal Visualization Plugin

```xml
<visualization name="Minimal Plugin">
    <description>Welcome to the Minimal Plugin.</description>
    <entry_point entry_point_type="script" src="minimal.js" />
</visualization>
```

minimal.js
```javascript
var element = document.getElementById("app");
var div = document.createElement('div');
div.innerText = JSON.stringify(JSON.parse(element.getAttribute("data-incoming")));
document.body.appendChild(div);
```