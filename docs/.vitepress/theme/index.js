// docs/.vitepress/theme/index.js or index.ts
import DefaultTheme from "vitepress/theme";
import Layout from "./Layout.vue";
import "./tailwind.css"; // Ensure this file exists and includes your Tailwind imports

export default {
    extends: DefaultTheme,
    Layout,
};
