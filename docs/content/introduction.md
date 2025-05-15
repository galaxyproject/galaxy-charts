---
outline: deep
---

# What is Galaxy Charts?

Galaxy Charts is the visualization plugin framework of the Galaxy platform. Designed with modern web development tools, Galaxy Charts uses the following technologies to create a flexible and dynamic environment for developing visualizations:

<div class="grid grid-cols-5 gap-12 text-center my-10">
    <div class="flex flex-col items-center">
        <img src="/vite.svg" alt="vite" class="w-16 h-16">
        <span class="font-bold mt-2">Vite</span>
    </div>
    <div class="flex flex-col items-center">
        <img src="/vitest.svg" alt="vitest" class="w-16 h-16">
        <span class="font-bold mt-2">Vitest</span>
    </div>
    <div class="flex flex-col items-center">
        <img src="/vue.svg" alt="vue" class="w-16 h-16">
        <span class="font-bold mt-2">Vue 3</span>
    </div>
    <div class="flex flex-col items-center">
        <img src="/naive-ui.svg" alt="naive-ui" class="w-16 h-16">
        <span class="font-bold mt-2">Naive UI</span>
    </div>
    <div class="flex flex-col items-center">
        <img src="/tailwind.svg" alt="tailwind" class="w-16 h-16">
        <span class="font-bold mt-2">Tailwind CSS</span>
    </div>
</div>

With Galaxy Charts, you can develop visualizations locally in Vue, taking advantage of advanced tooling like hot-reloading for instant feedback, efficient bundling for optimized performance, and other modern features. This setup enables a streamlined and responsive development experience.

<div class="flex justify-around items-center p-1">
  <img class="border-2 rounded border-gray-100" src="/galaxy-charts-demo.gif" alt="demo" width="80%">
</div>

### Key Features

- **Local and Remote Data Access**: Load data locally or connect to a remote Galaxy instance to access data providers and resources through the Galaxy API, giving you flexibility in sourcing data.
- **Automated Testing**: Test your visualization thoroughly in the local environment, ensuring it’s fully functional and bug-free before deploying it to Galaxy.
- **Enhanced Development Workflow**: By integrating state-of-the-art development tools, Galaxy Charts provides an efficient workflow that reduces the time and effort needed to build or embed 3rd-party visualizations.
- **Automated Form Rendering**: A standout feature of Galaxy Charts is its ability to dynamically generate an input form within a side panel on the right. This enables users to configure their visualizations.

In short, Galaxy Charts transforms and simplifies the process of developing and deploying visualizations on the Galaxy platform, offering an unparalleled experience for developers working in the Galaxy ecosystem.

### Alternative JS-Agnostic Approach Without Built-In Form
If your visualization does not require form rendering, or if you prefer not to use Vue, consider following the [lightweight Vite only approach](/content/xml-framework.html#building-a-vite-plugin-vanilla-vue-react-and-more). Both approaches utilize Vite as the underlying build tool. However, one includes a Vue component library for seamless form integration, while the other offers a more lightweight setup without Vue, giving you the flexibility to work with plain JavaScript or another framework of your choice.

This option is ideal for:

- Visualizations that don't require dynamic form inputs
- Developers who prefer working with vanilla JS, React, or other frameworks
- Simpler use cases where fast load times and minimal dependencies are key
