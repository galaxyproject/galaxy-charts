import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import App from "./App.vue";

const LOGO = "svg";

describe("build user interface", () => {
    test("Show form if dataset id and url are missing", async () => {
        const appDiv = document.createElement("div");
        appDiv.id = "app";
        document.body.appendChild(appDiv);
        const wrapper = mount(App);
        expect(wrapper.html()).toContain("Please wait...");
        await wrapper.vm.$nextTick();
        console.log(wrapper.html());
        expect(wrapper.find(LOGO).exists()).toBeTruthy();
        expect(wrapper.html()).toContain("Specify a visualization title.");
        expect(wrapper.html()).not.toContain("Settings: {}");
    });

    test("Load user interface using incoming prop", async () => {
        const incoming = {
            visualization_config: {
                dataset_url: null,
                dataset_id: "MY_DATASET_ID",
                settings: {
                    test_setting: "test_value",
                },
                tracks: [{ track_0: "track_0" }, { track_1: "track_1" }],
            },
        };
        const wrapper = mount(App, { props: { incoming } });
        expect(wrapper.html()).toContain("Please wait...");
        await wrapper.vm.$nextTick();
        expect(wrapper.find(LOGO).exists()).toBeTruthy();
        const pre = wrapper.findAll("pre");
        expect(pre.at(0).text().replace(/\s+/g, "")).toBe('Settings:{"test_setting":"test_value"}');
        expect(pre.at(1).text().replace(/\s+/g, "")).toBe('Tracks:[{"track_0":"track_0"},{"track_1":"track_1"}]');
    });
});
