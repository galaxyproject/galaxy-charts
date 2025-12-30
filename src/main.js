import { createApp, h } from "vue";
import App from "./App.vue";
import { parseXML } from "galaxy-charts-xml-parser";

async function main() {
    // Determine page url in dev environment, `window.location` is not available in production
    const pageUrl = new URL(window.location.href);

    // Construct the incoming data object with mock configuration and data
    const dataIncoming = {
        // Default root of server
        root: "/",
        // Visualization details
        visualization_config: {
            // Placeholder for dataset ID
            dataset_id: pageUrl.searchParams.get("dataset_id") || process.env.dataset_id || "__test__",
            // Placeholder for additional visualization settings
            settings: {},
        },
        // Parse and load the visualization XML configuration
        visualization_plugin: await parseXML("galaxy-charts.xml"),
    };

    // Attach config to the data-incoming attribute
    const appElement = document.querySelector("#custom");
    appElement.setAttribute("data-incoming", JSON.stringify(dataIncoming));

    // Add event listener
    window.addEventListener("message", (event) => {
        console.log("[charts] Outgoing message data:", event.data);
    });

    // Mount the app
    createApp({
        render: () => h(App, { collapse: false, container: "custom", credentials: process.env.credentials }),
    }).mount("#custom");
}

main();
