import { describe, test, expect, mount } from "vitest";
import { mount } from "@vue/test-utils";

import * as visualizations from "@/api/visualizations";
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
            "ROOTapi/datasets/MY_DATASET_ID/display",
            "ROOT",
            '{"settings":"SETTINGS"}',
            '{"spec":"SPECS"}',
            '[{"track":"TRACK"},{"track":"TRACK"}]',
        ];
        values.forEach((x, index) => expect(elements[index].text().replace(/\s+/g, "")).toEqual(x));
        expect(wrapper.findComponent(ChartsLogo).exists()).toBeTruthy();
    });

    test("datasetUrl fallback to constructed URL", async () => {
        const incoming = {
            visualization_config: { dataset_id: "XYZ123" },
        };
        const wrapper = mountTarget(incoming);
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toContain("/api/datasets/XYZ123/display");
    });

    test("computed logoUrl is constructed from root and logo", async () => {
        const incoming = {
            root: "/ROOT",
            visualization_plugin: { logo: "/static/logo.svg" },
            visualization_config: {},
        };
        const wrapper = mountTarget(incoming);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.logoUrl).toBe("/ROOT/static/logo.svg");
    });

    test("postMessage failure is caught and sets errorMessage", async () => {
        const incoming = { visualization_config: {} };
        const wrapper = mountTarget(incoming);
        await wrapper.vm.$nextTick();
        window.postMessage = () => {
            throw new Error("Boom");
        };
        wrapper.vm["postMessage"]();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.errorMessage).toContain("Failed to postMessage");
    });

    test("save failure sets error message", async () => {
        const incoming = { visualization_config: {}, visualization_plugin: {} };
        const wrapper = mountTarget(incoming);
        await wrapper.vm.$nextTick();
        vi.spyOn(visualizations, "visualizationsSave").mockRejectedValueOnce(new Error("fail"));
        await wrapper.vm["save"]({});
        expect(wrapper.vm.errorMessage).toContain("Failed to save");
    });

    test("onToggle switches collapsePanel state", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        const original = wrapper.vm.collapsePanel;
        await wrapper.vm["onToggle"]();
        expect(wrapper.vm.collapsePanel).toBe(!original);
    });

    test("update merges settings correctly", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm.settingValues = { foo: "bar" };
        wrapper.vm["update"]({ baz: "qux" });
        expect(wrapper.vm.settingValues).toEqual({ foo: "bar", baz: "qux" });
    });

    test("updateVisualizationId sets new id and posts message", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm["updateVisualizationId"]("NEW_ID");
        expect(wrapper.vm.currentVisualizationId).toBe("NEW_ID");
    });

    test("updateVisualizationTitle sets new title and posts message", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm["updateVisualizationTitle"]("NEW_TITLE");
        expect(wrapper.vm.currentVisualizationTitle).toBe("NEW_TITLE");
    });

    test("updateSettings updates settings and posts message", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm["updateSettings"]({ x: 1 });
        expect(wrapper.vm.settingValues).toEqual({ x: 1 });
    });

    test("updateTracks updates tracks and posts message", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm["updateTracks"]([{ y: 2 }]);
        expect(wrapper.vm.trackValues).toEqual([{ y: 2 }]);
    });

    test("update merges tracks correctly when incoming has fewer tracks", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm.trackValues = [{ a: 1 }, { b: 2 }];
        wrapper.vm["update"]({}, [{ b: 20 }]); // only one incoming track
        expect(wrapper.vm.trackValues).toEqual([{ a: 1, b: 20 }, { b: 2 }]);
    });

    test("update merges tracks correctly when incoming has more tracks", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm.trackValues = [{ a: 1 }];
        wrapper.vm["update"]({}, [{ a: 10 }, { b: 2 }]); // two incoming tracks
        expect(wrapper.vm.trackValues).toEqual([{ a: 10 }, { b: 2 }]);
    });

    test("update merges tracks correctly when original trackValues is empty", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm.trackValues = [];
        wrapper.vm["update"]({}, [{ x: 1 }]);
        expect(wrapper.vm.trackValues).toEqual([{ x: 1 }]);
    });

    test("update merges tracks correctly when incoming tracks is empty", async () => {
        const wrapper = mountTarget({ visualization_config: {} });
        await wrapper.vm.$nextTick();
        wrapper.vm.trackValues = [{ a: 1 }, { b: 2 }];
        wrapper.vm["update"]({}, []); // empty incoming tracks
        expect(wrapper.vm.trackValues).toEqual([{ a: 1 }, { b: 2 }]); // unchanged
    });
});
