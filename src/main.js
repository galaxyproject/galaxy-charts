import { createApp, h } from "vue";
import App from "./App.vue";
import { parseXML } from "galaxy-charts-xml-parser";

async function main() {
    // Construct the incoming data object with mock configuration and data
    const dataIncoming = {
        visualization_config: {
            // Placeholder for dataset ID
            dataset_id: process.env.dataset_id || "unavailable",
            // Placeholder for additional visualization settings
            settings: {
                my_data_name: {
                    hid: 1,
                    id: "dataset_id",
                    name: "dataset name",
                },
                my_data_table_name: {
                    id: "my_data_table_entry",
                },
                my_text_name: "My Test Setting",
                my_boolean_name: true,
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

    // Add event listener
    window.addEventListener("message", (event) => {
        console.log("[charts] Outgoing message data:", event.data);
    });

    // Mount the app
    createApp({
        render: () => h(App, { container: "custom", credentials: process.env.credentials }),
    }).mount("#custom");
}

main();
