import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InputDataColumn from "@/components/InputDataColumn.vue";

// Correct mock dataset
const mockDataset = {
    metadata_column_types: {
        0: "str", // should match isText
        1: "int", // should match isNumber
        2: "float", // should match isNumber
        3: "bool", // should be ignored
    },
};

// Mock Galaxy API
const mockGet = vi.fn().mockResolvedValue({ data: mockDataset });

vi.mock("@/api/client", () => ({
    GalaxyApi: () => ({
        GET: mockGet,
    }),
}));

describe("InputDataColumn.vue", () => {
    const mountComponent = (props = {}) =>
        mount(InputDataColumn, {
            props: {
                datasetId: "abc123",
                isAuto: true,
                isText: true,
                isNumber: true,
                ...props,
            },
        });

    test("loads and parses columns correctly", async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();
        expect(mockGet).toHaveBeenCalledWith("/api/datasets/abc123");
        await wrapper.vm.$nextTick();
        const options = wrapper.vm.currentOptions;
        expect(options).toEqual([
            { label: "Column: Default", value: "auto" },
            { label: "Column: 1", value: "0" },
            { label: "Column: 2", value: "1" },
            { label: "Column: 3", value: "2" },
        ]);
    });

    test("reinitializes currentValue if null", async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();
        wrapper.vm.currentValue = null;
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.currentValue).toBe("auto");
    });

    test("renders NSelect when datasetId is present", async () => {
        const wrapper = mountComponent();
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".n-select").exists()).toBe(true);
    });

    test("renders NInput when datasetId is missing", async () => {
        const wrapper = mountComponent({ datasetId: "" });
        await wrapper.vm.$nextTick();
        expect(wrapper.find(".n-input").exists()).toBe(true);
    });
});
