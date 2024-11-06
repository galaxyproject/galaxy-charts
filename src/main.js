import { createApp, h } from "vue";
import App from "./App.vue";

const config = {
    credentials: process.env.credentials,
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
};

const xml = "galaxy-charts.xml";

createApp({
    render: () => h(App, { config: config, xml: xml }),
}).mount("#app");
