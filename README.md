# <img src="https://cdn.jsdelivr.net/gh/galaxyproject/galaxy-charts/docs/public/galaxy-charts.svg" alt="Galaxy Charts Logo" width="24" /> Galaxy Charts

Galaxy Charts is the client-side browser plugin framework for the [Galaxy
Project](https://galaxyproject.org).

It provides the shared contract and runtime for building Galaxy
browser plugins: declaring plugin inputs, resolving their values
and options against Galaxy, managing configuration, and integrating
plugins with the Galaxy application.

Galaxy Charts also includes optional [Vue 3](https://vuejs.org/)
components for building configuration interfaces, including generated
input forms and a configurable side panel. Plugins themselves are
not required to use Vue and can be implemented with plain JavaScript or
any framework of your choice.

📘 **Documentation:** https://charts.galaxyproject.org

## 🧩 Architecture

Galaxy Charts separates the plugin framework from its user
interface:

- **Contract:** Input types, configuration shapes,
  option sources, defaults, and conditional inputs.
- **Runtime:** Headless input semantics such as resolving
  declared input options against Galaxy.
- **UI:** Optional Vue components for configuring and embedding
  plugins.

The same runtime semantics used by the Galaxy Charts UI are available to
headless consumers through:

```js
import { getOptions } from "galaxy-charts/runtime";
```

The headless runtime does not depend on Vue. Callers provide a Galaxy
client, allowing the runtime to be used outside the Galaxy Charts UI
while preserving the same input semantics.

## 🚀 Getting Started

The easiest way to start a plugin is with the [Galaxy Charts
Starter Template](https://github.com/guerler/galaxy-charts-starter):

```bash
npx degit guerler/galaxy-charts-starter my-viz
cd my-viz
npm install
npm run dev
```

The starter provides a development environment for building and testing
a plugin against Galaxy datasets.

You can also install Galaxy Charts directly:

```bash
npm install galaxy-charts
```

## ✨ Features

- **Galaxy plugin contract:** Shared input and configuration
  semantics for Galaxy browser plugins.
- **Headless runtime:** Consume input semantics without
  depending on Vue or the Galaxy UI.
- **Dynamic options:** Resolve dataset columns, history datasets,
  Galaxy data tables, remote option sources, and declared options.
- **Conditional inputs:** Define configuration structures whose
  available inputs depend on other selections.
- **Vue 3 UI:** Optional reusable components for generated
  configuration forms and plugin interfaces.
- **Galaxy integration:** Connect plugin configuration and
  runtime behavior directly to Galaxy.
- **Framework independent plugins:** Plugin
  implementations can use plain JavaScript or any UI framework.
- **Vite-based development:** Fast local development and production
  builds.

## 🔌 Plugins

Galaxy browser plugins declare their configurable inputs through the
Galaxy plugin definition. Galaxy Charts interprets those
declarations consistently across its UI and headless runtime.

This keeps input semantics in the plugin framework rather
than requiring each consumer to independently reproduce how Galaxy
plugin inputs work.

## 🤝 Contributing

Contributions are welcome. For fixes and smaller improvements, open a
pull request with a clear description of the change.

For larger architectural changes, opening an issue first is recommended
so the approach can be discussed before implementation.
