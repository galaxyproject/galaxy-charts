import { createApp, h } from "vue";
import App from "./App.vue";
import { parseXML } from "./utilities/parseXML";

async function main() {
    // Build the incoming data object
    const dataIncoming = {
        visualization_config: {
            dataset_url: null,
            dataset_id: "12e4b4feedfe9f3f",
            settings: {
                setting_text: "My Test Setting",
                setting_boolean: true,
                setting_conditional: {
                    case_false: "something else",
                    test_condition: "false",
                },
            },
        },
        visualization_plugin: await parseXML("galaxy-charts.xml"),
    };

    // Attach config to the data-incoming attribute
    const appElement = document.querySelector("#app");
    appElement.setAttribute("data-incoming", JSON.stringify(dataIncoming));

    // Mount the app
    createApp({
        render: () => h(App, { credentials: process.env.credentials }),
    }).mount("#app");
}

main();
