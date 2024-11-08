import { describe, test, expect, mount } from "vitest";
import { mount } from "@vue/test-utils";

import Target from "./GalaxyCharts.vue";

function mountTarget(incoming) {
    return mount(Target, {
        props: { incoming: incoming },
        slots: {
            default: `<template #default="{ datasetId, datasetUrl, root, settings, specs, tracks }">
                <pre>{{ datasetId }}</pre>
                <pre>{{ datasetUrl }}</pre>
                <pre>{{ root }}</pre>
                <pre>{{ settings }}</pre>
                <pre>{{ specs }}</pre>
                <pre>{{ tracks }}</pre>
            </template>`,
        },
    });
}

describe("build user interface", () => {
    test("Show error if dataset id and url are missing", async () => {
        const wrapper = mount(Target);
        expect(wrapper.html()).toContain("Visualization requires `dataset_id` or `dataset_url`.");
    });

    test("Load user interface only dataset id", async () => {
        const incoming = {
            visualization_config: { dataset_id: "MY_DATASET_ID" },
        };
        const wrapper = mountTarget(incoming);
        expect(wrapper.html()).toContain("Please wait...");
        await wrapper.vm.$nextTick();
        const elements = wrapper.findAll("pre");
        const values = ["MY_DATASET_ID", "/api/datasets/MY_DATASET_ID/display", "/", "{}", "{}", "[]"];
        values.forEach((x, index) => expect(elements[index].text()).toEqual(x));
        expect(wrapper.html()).not.toContain('fill="#E30A17"');
    });

    test("Load user interface", async () => {
        const incoming = {
            root: "ROOT",
            visualization_config: {
                dataset_id: "MY_DATASET_ID",
                dataset_url: "MY_DATASET_URL",
                settings: "SETTINGS",
                tracks: "TRACKS",
            },
            visualization_plugin: {
                specs: "SPECS",
            },
        };
        const wrapper = mountTarget(incoming);
        expect(wrapper.html()).toContain("Please wait...");
        await wrapper.vm.$nextTick();
        const elements = wrapper.findAll("pre");
        const values = ["MY_DATASET_ID", "MY_DATASET_URL", "ROOT", "SETTINGS", "SPECS", "TRACKS"];
        values.forEach((x, index) => expect(elements[index].text()).toEqual(x));
        expect(wrapper.html()).not.toContain('fill="#E30A17"');
    });
});
