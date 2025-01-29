import { createApp, h } from "vue";
import App from "./App.vue";
import { parseXML } from "galaxy-charts-xml-parser";

async function main() {
    // Construct the incoming data object with mock configuration and data
    const dataIncoming = {
        visualization_config: {
            // Placeholder for dataset URL (can be replaced during actual development)
            dataset_url: "MY_DATASET_URL",
            // Placeholder for dataset ID
            dataset_id: process.env.dataset_id,
            // Placeholder for additional visualization settings
            settings: {
                setting_text: "My Test Setting",
                setting_boolean: true,
                setting_conditional: {
                    case_false: "something else",
                    test_condition: "false",
                },
            },
        },
        // Parse and load the visualization XML configuration
        visualization_plugin: await parseXML("galaxy-charts.xml"),
    };

    // Attach config to the data-incoming attribute
    const appElement = document.querySelector("#custom");
    appElement.setAttribute("data-incoming", JSON.stringify(dataIncoming));

    // Mount the app
    createApp({
        render: () => h(App, { container: "custom", credentials: process.env.credentials }),
    }).mount("#custom");
}

main();
