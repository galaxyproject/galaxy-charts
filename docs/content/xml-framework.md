# Understanding the Visualization Framework

The following sections offer valuable insights into the underlying details of the visualization framework. These details enhance understanding of the framework’s flexibility and the range of possibilities it offers.

## XML Parsing During Galaxy Startup

Let's break down the XML structure and examine how Galaxy processes it to understand the Galaxy visualization framework. This will highlight the full capabilities of the framework, which can support any JavaScript-based plugin—not just those built with Vue.

On startup, Galaxy installs visualization plugins from published `npm` packages. Each package must include a `static` directory.

The `static` directory should contain:
- The plugin’s JavaScript code
- A style sheet (if applicable)
- An XML wrapper file
- Optionally, a logo file (`.svg`) and other static assets

Galaxy expects the XML file to reside in the plugin's `static` directory. At runtime, it should be accessible from the Galaxy root as:

```
config/plugins/visualizations/MY_VISUALIZATION/static/MY_VISUALIZATION.xml
```

During startup, Galaxy validates this XML file and adds the visualization to the list available in the activity bar.

> **Note:** Replace `MY_VISUALIZATION` with the actual name of your visualization plugin.

This completes the installation of the visualization in Galaxy.

## Selection and Dataset Assignment

When a user selects a visualization in the Galaxy interface, Galaxy requires a dataset to be assigned to it. It will either select a dataset from the user's history, or prompt the user to choose a compatible dataset. For information on specifying compatible data types, see the `data_sources` XML section in [Data Sources](xml-datasources).

## Initialization Process

Once the visualization and dataset are selected, Galaxy reads the `entry_point` section in the XML:

```xml
<entry_point src="index.js" css="index.css" container="app" />
```

The entry_point section includes the following parameters:

| Variable | Description |
|----------|-------------|
| **src** | The path to the JavaScript bundle within the visualization’s static directory. |
| **css** | (Optional) The path to a CSS file within the visualization’s static directory. |
| **container** | The DOM container ID that the visualization will use (default is "app"). |

## Populating the Script Template

Galaxy Charts includes a minimal JavaScript-based visualization interface called the script endpoint. While the Galaxy Charts Vue package builds on this foundation, the script endpoint can be used independently and is compatible with any JavaScript framework. To understand how the core framework works, let’s examine this interface.

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

In this template, Galaxy populates the `css`, `src`, and `container` attributes with static values from the visualization XML. The `data-incoming` attribute is dynamically populated by Galaxy with details such as the dataset ID, settings, and visualization plugin metadata.

## The Minimal Visualization Plugin

Armed with this foundational knowledge, let’s explore a simple, concrete example of a visualization plugin, implemented with just two files.

### Step 1: Start with XML Configuration

The plugin XML file (`minimal.xml`) defines the plugin’s name, a brief description, and specifies `minimal.js` as the entry point for the functionality:

```xml
<visualization name="Minimal Plugin">
    <description>A basic example of a visualization plugin.</description>
    <entry_point src="minimal.js" />
</visualization>
```

### Step 2: Add a Script File

The core of the plugin, contained in minimal.js, is minimalistic: it retrieves the data injected into the DOM container by Galaxy, then formats and displays it within a new div element. This approach demonstrates a straightforward method to access and render data within a plugin.

```javascript
// minimal.js
var element = document.getElementById("app");
element.innerText = element.dataset.incoming;
```

This basic setup captures the essentials of a visualization plugin: it identifies where to find the incoming data, processes it (in this case, by parsing and converting it to a readable format), and outputs it to the screen.

This minimal plugin example provides a foundation on which more complex visualization functionalities can be built, with ease of modification and scalability in mind.

A similar example is shipped with Galaxy at: https://github.com/galaxyproject/galaxy/tree/dev/config/plugins/visualizations/example.

::: tip Note
For this plugin, as well as any other, all further interactions with Galaxy should be conducted through the Galaxy API.
:::

## Building a Vite Plugin (Vanilla/Vue/React and More)

In this section, we'll create a slightly more complex plugin using [Vite](https://vite.dev). Vite supports a range of JavaScript-based languages, and the steps here apply to all of them.

### Step 1: Create a Vite Project

To create a new Vite project, replace `MY_VISUALIZATION` with your visualization name and run the following command:

```bash
npm create vite@latest MY_VISUALIZATION
```

Follow the prompts and choose any of the provided templates. If you're unfamiliar with certain frameworks, we recommend opting for plain Vanilla JavaScript without TypeScript.

### Step 2: Import the Charts Vite Configuration

Download the charts configuration file <a href="/galaxy-charts/downloads/vite.config.charts.js" download>vite.config.charts.js</a> to your visualization root directory:

```bash
wget https://galaxyproject.github.io/galaxy-charts/downloads/vite.config.charts.js -O vite.config.charts.js
```

Then, import it into your existing `vite.config` (or create a new one) as follows:

```bash
import { defineConfig } from "vite";
import { viteConfigCharts } from "./vite.config.charts";

export default defineConfig({
    ...viteConfigCharts,
    /* Insert your existing vite.config settings here. */
});
```

Now that we've added the Galaxy Charts configuration, you can proxy your URL request to a Galaxy server following the [Connect to Galaxy](configuration.html) description.

### Step 3: Add the XML Configuration

We'll now continue with an XML configuration example. This builds upon the minimal example introduced earlier, using the default XML template discussed in the introduction.

Place the following XML file into your Vite project's `public` directory:

```xml
<visualization name="Vite Plugin (Vanilla/Vue/React and more)">
    <description>A basic example of a Vite plugin.</description>
    <entry_point src="index.js" css="index.css" />
</visualization>
```

You should also add a `logo.svg` file to the same directory. This will be used as the visualization’s icon in the Galaxy activity bar.

### Step 4: Add Logic to Access Incoming Data from Galaxy

Once your visualization is deployed, Galaxy will pass configuration data to it by attaching the data to the `data-incoming` attribute of the `#app` container element. To handle and utilize this data within your visualization, add the following logic to your main code file:

```javascript
// Access container element
const appElement = document.querySelector("#app");

// Attach mock data for development
if (import.meta.env.DEV) {
    // Build the incoming data object
    const dataIncoming = {
        root: "/",
        visualization_config: {
            dataset_id: process.env.dataset_id,
        },
    };

    // Attach config to the data-incoming attribute
    appElement.dataset.incoming = JSON.stringify(dataIncoming);
}

// Access attached data
const incoming = JSON.parse(appElement?.dataset.incoming || "{}");

/** Now you can consume the incoming data in your application.
 * In this example, the data was attached in the development mode block.
 * In production, this data will be provided by Galaxy.
 */
const datasetId = incoming.visualization_config.dataset_id;
const root = incoming.root;

/* Build the data request url. Modify the API route if necessary. */
const url = `${root}api/datasets/${datasetId}/display`;

/* Place your code here... */
```

Once development is complete, you now can follow the steps in the [Deploy to Galaxy](deploy-plugin) section to publish your visualization.

::: tip Note
Unlike the Galaxy Charts Vue package, the input form will not be automatically rendered. However, if your visualization does not require user-configurable settings, this approach might be a better fit. It introduces less overhead and offers greater flexibility, allowing you to work with a variety of JavaScript frameworks or libraries.
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
