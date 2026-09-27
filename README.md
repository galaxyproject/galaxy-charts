# <img src="https://cdn.jsdelivr.net/gh/galaxyproject/galaxy-charts/docs/public/galaxy-charts.svg" alt="Galaxy Charts Logo" width="24" /> Galaxy Charts

Galaxy Charts is the client-side visualization framework for the [Galaxy
Project](https://galaxyproject.org).

It provides the shared contract and runtime for building Galaxy
visualizations: declaring visualization inputs, resolving their values
and options against Galaxy, managing configuration, and integrating
visualizations with the Galaxy application.

Galaxy Charts also includes optional [Vue 3](https://vuejs.org/)
components for building configuration interfaces, including generated
input forms and a configurable side panel. Visualizations themselves are
not required to use Vue and can be implemented with plain JavaScript or
any framework of your choice.

📘 **Documentation:** https://charts.galaxyproject.org

## 🧩 Architecture

Galaxy Charts separates the visualization framework from its user
interface:

-   **Declaration contract** --- input types, configuration shapes,
    option sources, defaults, and conditional inputs.
-   **Runtime** --- headless visualization semantics such as resolving
    declared input options against Galaxy.
-   **UI** --- optional Vue components for configuring and embedding
    visualizations.

The same runtime semantics used by the Galaxy Charts UI are available to
headless consumers through:

``` js
import { getOptions } from "galaxy-charts/runtime";
```

The headless runtime does not depend on Vue. Callers provide a Galaxy
client, allowing the runtime to be used outside the Galaxy Charts UI
while preserving the same visualization semantics.

## 🚀 Getting Started

The easiest way to start a visualization is with the [Galaxy Charts
Starter Template](https://github.com/guerler/galaxy-charts-starter):

``` bash
npx degit guerler/galaxy-charts-starter my-viz
cd my-viz
npm install
npm run dev
```

The starter provides a development environment for building and testing
a visualization against Galaxy datasets.

You can also install Galaxy Charts directly:

``` bash
npm install galaxy-charts
```

## ✨ Features

-   **Galaxy visualization contract** --- shared input and configuration
    semantics for Galaxy visualization plugins.
-   **Headless runtime** --- consume visualization semantics without
    depending on Vue or the Galaxy UI.
-   **Dynamic options** --- resolve dataset columns, history datasets,
    Galaxy data tables, remote option sources, and declared options.
-   **Conditional inputs** --- define configuration structures whose
    available inputs depend on other selections.
-   **Vue 3 UI** --- optional reusable components for generated
    configuration forms and visualization interfaces.
-   **Galaxy integration** --- connect visualization configuration and
    runtime behavior directly to Galaxy.
-   **Framework independent visualizations** --- visualization
    implementations can use plain JavaScript or any UI framework.
-   **Vite-based development** --- fast local development and production
    builds.

## 🔌 Plugins

Galaxy visualizations declare their configurable inputs through the
Galaxy visualization plugin definition. Galaxy Charts interprets those
declarations consistently across its UI and headless runtime.

This keeps visualization semantics in the visualization framework rather
than requiring each consumer to independently reproduce how Galaxy
visualization inputs work.

## 🤝 Contributing

Contributions are welcome. For fixes and smaller improvements, open a
pull request with a clear description of the change.

For larger architectural changes, opening an issue first is recommended
so the approach can be discussed before implementation.
