import { createApp, h } from "vue";
import App from "./App.vue";

const config = {
    credentials: process.env.credentials,
    dataset_url: null,
    dataset_id: "unavailable",
    settings: {
        setting_text: "My Test Setting",
        setting_boolean: true,
    },
};

const xml = "galaxy-charts.xml";

createApp({
    render: () => h(App, { config: config, xml: xml }),
}).mount("#app");
