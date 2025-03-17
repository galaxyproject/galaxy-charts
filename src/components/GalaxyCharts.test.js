import { describe, test, expect, mount } from "vitest";
import { mount } from "@vue/test-utils";

import ChartsLogo from "./ChartsLogo.vue";
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
        expect(wrapper.html()).toContain('fill="#E30A17"');
    });

    test("Load user interface", async () => {
        const incoming = {
            root: "ROOT",
            visualization_config: {
                dataset_id: "MY_DATASET_ID",
                dataset_url: "MY_DATASET_URL",
                settings: { settings: "SETTINGS" },
                tracks: [{ track: "TRACK" }, { track: "TRACK" }],
            },
            visualization_plugin: {
                specs: { spec: "SPECS" },
            },
        };
        const wrapper = mountTarget(incoming);
        expect(wrapper.html()).toContain("Please wait...");
        await wrapper.vm.$nextTick();
        const elements = wrapper.findAll("pre");
        const values = [
            "MY_DATASET_ID",
            "MY_DATASET_URL",
            "ROOT",
            '{"settings":"SETTINGS"}',
            '{"spec":"SPECS"}',
            '[{"track":"TRACK"},{"track":"TRACK"}]',
        ];
        values.forEach((x, index) => expect(elements[index].text().replace(/\s+/g, "")).toEqual(x));
        expect(wrapper.findComponent(ChartsLogo).exists()).toBeTruthy();
    });
});
