# Understanding the Galaxy Visualization Framework

The following sections are not mandatory for developing Galaxy Charts visualizations, but they offer valuable insights into Galaxy's underlying visualization framework. These details enhance understanding of the framework’s flexibility and the range of possibilities it offers.

## XML Parsing During Galaxy Startup

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

Armed with this foundational knowledge, let’s explore a simple, concrete example of a visualization plugin, implemented with just two files.

The plugin XML file (`plugin.xml`) defines the plugin’s name, a brief description, and specifies `minimal.js` as the entry point for the functionality:

```xml
<visualization name="Minimal Plugin">
    <description>A basic example of a visualization plugin.</description>
    <entry_point entry_point_type="script" src="minimal.js" />
</visualization>
```

The core of the plugin, contained in minimal.js, is minimalistic: it retrieves the data injected into the DOM container by Galaxy, then formats and displays it within a new div element. This approach demonstrates a straightforward method to access and render data within a plugin.

```javascript
// minimal.js
var element = document.getElementById("app");
var div = document.createElement('div');
div.innerText = JSON.stringify(JSON.parse(element.getAttribute("data-incoming")));
document.body.appendChild(div);
```

This basic setup captures the essentials of a visualization plugin: it identifies where to find the incoming data, processes it (in this case, by parsing and converting it to a readable format), and outputs it to the screen.

This minimal plugin example provides a foundation on which more complex visualization functionalities can be built, with ease of modification and scalability in mind.

::: tip Note
For this plugin, as well as any other, all further interactions with Galaxy should be conducted through the Galaxy API.
:::

## Use any JavaScript Technology!

In summary, the Galaxy framework is designed to be highly flexible, supporting any JavaScript-based framework or tool of choice. To integrate with Galaxy, the only requirement is to include the bundled JavaScript and CSS files within the static directory of the npm package. This approach allows developers to work with their preferred frameworks and tools, ensuring compatibility without additional configuration or dependencies. This streamlined setup makes it easy to extend Galaxy's functionality while maintaining consistency and simplicity across various plugin implementations.

Here is a list of popular tools to consider for your visualization plugin:

<div class="grid grid-cols-4 gap-12 text-center my-10">
  <div class="flex flex-col items-center">
    <img src="/javascript.svg" alt="JavaScript" class="w-16 h-16">
    <span class="font-bold mt-2">JavaScript</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/typescript.svg" alt="TypeScript" class="w-16 h-16">
    <span class="font-bold mt-2">TypeScript</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/react.svg" alt="React" class="w-16 h-16">
    <span class="font-bold mt-2">React</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/next-js.svg" alt="Next.js" class="w-16 h-16">
    <span class="font-bold mt-2">Next.js</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/vue.svg" alt="Vue" class="w-16 h-16">
    <span class="font-bold mt-2">Vue</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/vite.svg" alt="Vite" class="w-16 h-16">
    <span class="font-bold mt-2">Vite</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/vuetify.svg" alt="Vuetify" class="w-16 h-16">
    <span class="font-bold mt-2">Vuetify</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/nuxt.svg" alt="Nuxt" class="w-16 h-16">
    <span class="font-bold mt-2">Nuxt</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/naive-ui.svg" alt="Naive UI" class="w-16 h-16">
    <span class="font-bold mt-2">Naive UI</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/tailwind.svg" alt="Tailwind CSS" class="w-16 h-16">
    <span class="font-bold mt-2">Tailwind CSS</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/eslint.svg" alt="ES Lint" class="w-16 h-16">
    <span class="font-bold mt-2">ES Lint</span>
  </div>
  <div class="flex flex-col items-center">
    <img src="/prettier.svg" alt="Prettier" class="w-16 h-16">
    <span class="font-bold mt-2">Prettier</span>
  </div>
</div>
