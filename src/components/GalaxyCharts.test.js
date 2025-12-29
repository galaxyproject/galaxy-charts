import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";

import * as visualizations from "@/api/visualizations";
import ChartsLogo from "@/components/ChartsLogo.vue";
import SideButton from "@/components/SideButton.vue";
import SidePanel from "@/components/SidePanel.vue";
import Target from "@/components/GalaxyCharts.vue";

const VIEWPORT = ".grid-cols-\\[1fr_20rem\\]";
function mountTarget({ collapse, incoming }) {
    return mount(Target, {
        props: { collapse, incoming },
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
        const wrapper = mountTarget({ incoming });
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
        const wrapper = mountTarget({ incoming });
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
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toContain("/api/datasets/XYZ123/display");
    });

    test("computed logoUrl is constructed from root and logo", async () => {
        const incoming = {
            root: "/ROOT",
            visualization_plugin: { logo: "/static/logo.svg" },
            visualization_config: {},
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.logoUrl).toBe("/ROOT/static/logo.svg");
    });

    test("postMessage failure is caught and sets errorMessage", async () => {
        const incoming = { visualization_config: {} };
        const wrapper = mountTarget({ incoming });
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
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        vi.spyOn(visualizations, "visualizationsSave").mockRejectedValueOnce(new Error("fail"));
        await wrapper.vm["save"]({});
        expect(wrapper.vm.errorMessage).toContain("Failed to save");
    });

    test("onToggle switches collapsePanel state", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        const original = wrapper.vm.collapsePanel;
        await wrapper.vm["onToggle"]();
        expect(wrapper.vm.collapsePanel).toBe(!original);
    });

    test("update merges settings correctly", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm.settingValues = { foo: "bar" };
        wrapper.vm["update"]({ baz: "qux" });
        expect(wrapper.vm.settingValues).toEqual({ foo: "bar", baz: "qux" });
    });

    test("updateVisualizationId sets new id and posts message", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm["updateVisualizationId"]("NEW_ID");
        expect(wrapper.vm.currentVisualizationId).toBe("NEW_ID");
    });

    test("updateVisualizationTitle sets new title and posts message", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm["updateVisualizationTitle"]("NEW_TITLE");
        expect(wrapper.vm.currentVisualizationTitle).toBe("NEW_TITLE");
    });

    test("updateSettings updates settings and posts message", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm["updateSettings"]({ x: 1 });
        expect(wrapper.vm.settingValues).toEqual({ x: 1 });
    });

    test("updateTracks updates tracks and posts message", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm["updateTracks"]([{ y: 2 }]);
        expect(wrapper.vm.trackValues).toEqual([{ y: 2 }]);
    });

    test("update merges tracks correctly when incoming has fewer tracks", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm.trackValues = [{ a: 1 }, { b: 2 }];
        wrapper.vm["update"]({}, [{ b: 20 }]); // only one incoming track
        expect(wrapper.vm.trackValues).toEqual([{ a: 1, b: 20 }, { b: 2 }]);
    });

    test("update merges tracks correctly when incoming has more tracks", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm.trackValues = [{ a: 1 }];
        wrapper.vm["update"]({}, [{ a: 10 }, { b: 2 }]); // two incoming tracks
        expect(wrapper.vm.trackValues).toEqual([{ a: 10 }, { b: 2 }]);
    });

    test("update merges tracks correctly when original trackValues is empty", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm.trackValues = [];
        wrapper.vm["update"]({}, [{ x: 1 }]);
        expect(wrapper.vm.trackValues).toEqual([{ x: 1 }]);
    });

    test("update merges tracks correctly when incoming tracks is empty", async () => {
        const wrapper = mountTarget({ incoming: { visualization_config: {} } });
        await wrapper.vm.$nextTick();
        wrapper.vm.trackValues = [{ a: 1 }, { b: 2 }];
        wrapper.vm["update"]({}, []); // empty incoming tracks
        expect(wrapper.vm.trackValues).toEqual([{ a: 1 }, { b: 2 }]); // unchanged
    });

    test("Panel should be hidden when no dataset, no settings, no tracks, no assistant", async () => {
        const incoming = {
            visualization_config: {},
            visualization_plugin: {
                settings: [],
                tracks: [],
                specs: {},
            },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasDataset).toBe(false);
        expect(wrapper.vm.hasPanel).toBe(false);
        expect(wrapper.find(VIEWPORT).exists()).toBe(false);
        expect(wrapper.findComponent(SidePanel).isVisible()).toBe(true); // Always visible when no dataset
    });

    test("Panel should be visible when has dataset and settings", async () => {
        const incoming = {
            visualization_config: { dataset_id: "DATASET_1" },
            visualization_plugin: {
                settings: [{ name: "setting1", type: "text" }],
                tracks: [],
                specs: {},
            },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasDataset).toBe(true);
        expect(wrapper.vm.hasSettings).toBe(true);
        expect(wrapper.vm.hasPanel).toBe(true);
        expect(wrapper.find(VIEWPORT).exists()).toBe(true);
    });

    test("Panel should be visible when has dataset and tracks", async () => {
        const incoming = {
            visualization_config: { dataset_id: "DATASET_1" },
            visualization_plugin: {
                settings: [],
                tracks: [{ name: "track1", type: "text" }],
                specs: {},
            },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasDataset).toBe(true);
        expect(wrapper.vm.hasTracks).toBe(true);
        expect(wrapper.vm.hasPanel).toBe(true);
        expect(wrapper.find(VIEWPORT).exists()).toBe(true);
    });

    test("Panel should be visible when has dataset and chat", async () => {
        const incoming = {
            visualization_config: { dataset_id: "DATASET_1" },
            visualization_plugin: {
                settings: [],
                tracks: [],
                specs: { chat: true },
            },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasDataset).toBe(true);
        expect(wrapper.vm.hasChat).toBe(true);
        expect(wrapper.vm.hasPanel).toBe(true);
        expect(wrapper.find(VIEWPORT).exists()).toBe(true);
    });

    test("Panel should be hidden when collapsed (hasPanel true but collapsePanel true)", async () => {
        const wrapper = mountTarget({
            collapse: true,
            incoming: {
                visualization_config: { dataset_id: "DATASET_1" },
                visualization_plugin: {
                    settings: [{ name: "setting1", type: "text" }],
                    tracks: [],
                    specs: {},
                },
            },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasPanel).toBe(true);
        expect(wrapper.vm.collapsePanel).toBe(true);
        expect(wrapper.find(VIEWPORT).exists()).toBe(false);
        const sidePanel = wrapper.findComponent(SidePanel);
        const shouldShowPanel = (!wrapper.vm.collapsePanel && wrapper.vm.hasPanel) || !wrapper.vm.hasDataset;
        expect(shouldShowPanel).toBe(false);
        expect(sidePanel.attributes("style")).toContain("display: none");
    });

    test("Panel should always be visible when no dataset (even if no settings/tracks/assistant)", async () => {
        const incoming = {
            visualization_config: {},
            visualization_plugin: {
                settings: [],
                tracks: [],
                specs: {},
            },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasDataset).toBe(false);
        expect(wrapper.vm.hasPanel).toBe(false);
        const sidePanel = wrapper.findComponent(SidePanel);
        expect(sidePanel.attributes("style") || "").not.toContain("display: none");
    });

    test("SideButton should be visible when panel is collapsed but should be shown", async () => {
        const incoming = {
            collapse: true,
            visualization_config: { dataset_id: "DATASET_1" },
            visualization_plugin: {
                settings: [{ name: "setting1", type: "text" }],
                tracks: [],
                specs: {},
            },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        const sideButton = wrapper.findComponent(SideButton);
        expect(sideButton.exists()).toBe(true);
        expect(sideButton.props("visible")).toBe(true);
    });

    test("SideButton should be hidden when no panel content", async () => {
        const incoming = {
            visualization_config: { dataset_id: "DATASET_1" },
            visualization_plugin: {
                settings: [],
                tracks: [],
                specs: {},
            },
        };
        const wrapper = mountTarget({ collapse: true, incoming });
        await wrapper.vm.$nextTick();
        const sideButton = wrapper.findComponent(SideButton);
        expect(sideButton.props("visible")).toBe(false);
    });
});

describe("Computed property edge cases", () => {
    test("hasChat should be false when chat is not set", async () => {
        const incoming = {
            visualization_config: {},
            visualization_plugin: {},
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasChat).toBe(false);
    });

    test("hasDataset should handle empty string dataset_id", async () => {
        const incoming = {
            visualization_config: { dataset_id: "" },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasDataset).toBe(false);
    });

    test("hasDataset should handle null dataset_id", async () => {
        const incoming = {
            visualization_config: { dataset_id: null },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasDataset).toBe(false);
    });

    test("hasDataset should handle undefined dataset_id", async () => {
        const incoming = {
            visualization_config: {},
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.hasDataset).toBe(false);
    });
});

describe("Slot rendering conditions", () => {
    test("Slot should not render when no dataset", async () => {
        const incoming = {
            visualization_config: {},
            visualization_plugin: {
                settings: [{ name: "setting1", type: "text" }],
            },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("pre").exists()).toBe(false); // Slot content
        expect(wrapper.findComponent(SidePanel).isVisible()).toBe(true);
    });

    test("Slot should render when dataset exists", async () => {
        const incoming = {
            visualization_config: { dataset_id: "DATASET_1" },
            visualization_plugin: {},
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();
        expect(wrapper.find("pre").exists()).toBe(true); // Slot content
        expect(wrapper.text()).toContain("DATASET_1");
    });

    test("Loading state shows while plugin is being parsed", async () => {
        const incoming = {
            visualization_config: { dataset_id: "DATASET_1" },
        };
        const wrapper = mountTarget({ incoming });
        expect(wrapper.html()).toContain("Please wait...");
        expect(wrapper.find(".grid").exists()).toBe(false);
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).not.toContain("Please wait...");
        expect(wrapper.find(".grid").exists()).toBe(true);
    });

    test("SidePanel receives correct props", async () => {
        const incoming = {
            visualization_config: {
                dataset_id: "DATASET_1",
                settings: { color: "red" },
            },
            visualization_plugin: {
                name: "Test Plugin",
                description: "Test Description",
                html: "<p>Test HTML</p>",
                logo: "/logo.png",
                settings: [{ name: "color", type: "text" }],
            },
        };
        const wrapper = mountTarget({ incoming });
        await wrapper.vm.$nextTick();

        const sidePanel = wrapper.findComponent(SidePanel);
        expect(sidePanel.props()).toMatchObject({
            datasetId: "DATASET_1",
            pluginName: "Test Plugin",
            pluginDescription: "Test Description",
            pluginHtml: "<p>Test HTML</p>",
            settingInputs: [{ name: "color", type: "text" }],
            settingValues: { color: "red" },
        });
    });

    test("SideButton receives correct props", async () => {
        const incoming = {
            visualization_config: { dataset_id: "DATASET_1" },
            visualization_plugin: {
                settings: [{ name: "setting1", type: "text" }],
            },
        };
        const wrapper = mountTarget({ collapse: false, incoming });
        await wrapper.vm.$nextTick();
        const sideButton = wrapper.findComponent(SideButton);
        expect(sideButton.props("visible")).toBe(false);
        await wrapper.vm.onToggle();
        await wrapper.vm.$nextTick();
        expect(sideButton.props("visible")).toBe(true);
    });
});
