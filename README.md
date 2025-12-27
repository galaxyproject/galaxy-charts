# <img src="https://cdn.jsdelivr.net/gh/galaxyproject/galaxy-charts/docs/public/galaxy-charts.svg" alt="Galaxy Charts Logo" width="24" /> Galaxy Charts UI

An optional user interface package for the Galaxy Charts visualization framework, built with [Vue 3](https://vuejs.org/) and [Vite](https://vitejs.dev/).

Galaxy Charts UI provides reusable UI components for configuring Galaxy visualizations, such as auto-generated input forms and a configurable side panel.

💡 This package is not required to build Galaxy visualizations.
Galaxy Charts visualizations can be implemented with plain JavaScript or any framework of your choice, with or without this UI package.

Galaxy Charts itself is a modern JavaScript visualization framework for the [Galaxy Project](https://galaxyproject.org), providing the core infrastructure for developing Galaxy visualizations through a simple and extensible plugin interface. Galaxy Charts UI builds on top of this foundation by offering an optional Vue-based user interface.

💡 To quickly start building your own Galaxy visualizations using Galaxy Charts UI, use the [Galaxy Charts Starter Template](https://github.com/guerler/galaxy-charts-starter) and run `npm install && npm run dev`.


📘 **Documentation**: [https://charts.galaxyproject.org](https://charts.galaxyproject.org)

---

## 🚀 Getting Started

To build your own visualization:

1. **Use the Starter Template**  
   Begin with the ready-to-go starter project:
   ```bash
   npx degit guerler/galaxy-charts-starter my-viz
   cd my-viz
   npm install
   npm run dev
   ```

2. **Develop Your Plugin**  
   Customize the included plugin or create your own inside the `src/plugins` directory.

3. **Preview and Iterate**  
   Use the development server (`http://localhost:3000`) to test your visualization live against Galaxy datasets.

---

## ✨ Features

- ⚡ **Built with Vite**: Fast bundling and lightning-fast hot module replacement.
- 🎨 **Vue 3 Components**: Use composable and reactive components for visualizations.
- 🔌 **Plugin Architecture**: Create, test, and extend visualizations as isolated plugins.
- 🌐 **Connect to Galaxy**: Pull datasets from any accessible Galaxy instance.
- 🧪 **Test with Real Data**: Debug and verify visualizations with real datasets before deployment.
- 📦 **Deploy-Ready**: Easily publish plugins or integrate into Galaxy instances.

---

## 🤝 Contributing

We welcome contributions from the community! To get started:

1. Fork the repository.
2. Create a new branch for your feature or fix.
3. Make your changes.
4. Open a pull request with a clear description of what you’ve done.

For larger changes or questions, feel free to open an issue first to discuss it with the maintainers.

---
