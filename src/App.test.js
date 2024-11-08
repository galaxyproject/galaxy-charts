import { describe, test, expect, mount } from "vitest";
import { mount } from "@vue/test-utils";

import App from "./App.vue";

describe("build user interface", () => {
    test("Show error if dataset id and url are missing", async () => {
        const wrapper = mount(App);
        expect(wrapper.html()).toContain("Visualization requires `dataset_id` or `dataset_url`.");
    });

    test("Load user interface using incoming prop", async () => {
        const incoming = {
            visualization_config: {
                dataset_url: null,
                dataset_id: "MY_DATASET_ID",
            },
        };
        const wrapper = mount(App, { props: { incoming: incoming } });
        expect(wrapper.html()).toContain("Please wait...");
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).not.toContain('fill="#E30A17"');
    });
});
