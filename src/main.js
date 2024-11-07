import { createApp, h } from "vue";
import App from "./App.vue";

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
};

const xml = "galaxy-charts.xml";

// Attach config to the data-incoming attribute
const appElement = document.querySelector("#app");
appElement.setAttribute("data-incoming", JSON.stringify(dataIncoming));

createApp({
    render: () => h(App, { credentials: process.env.credentials, xml: xml }),
}).mount("#app");
