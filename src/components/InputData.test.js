import { describe, test, expect, vi, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import InputData from "@/components/InputData.vue";

// Shared Galaxy API mock
const mockGet = vi.fn().mockResolvedValue({
    data: [
        { id: "1", hid: "1", name: "dataset1.csv" },
        { id: "2", hid: "2", name: "dataset2.csv" },
    ],
});

vi.mock("@/api/client", () => ({
    GalaxyApi: () => ({
        GET: mockGet,
    }),
}));

describe("InputData.vue", () => {
    const mountComponent = (props = {}) =>
        mount(InputData, {
            props: {
                datasetId: "123",
                optional: false,
                ...props,
            },
        });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("loads datasets on mount", async () => {
        const wrapper = mountComponent();
        await flushPromises();
        await wrapper.vm.$nextTick();
        const options = wrapper.vm.currentOptions;
        expect(mockGet).toHaveBeenCalled();
        expect(options.length).toBe(3);
        expect(options[0].label).toBe("1: dataset1.csv");
    });

    test("adds clear option if optional", async () => {
        const wrapper = mountComponent({ optional: true });
        await flushPromises();
        await wrapper.vm.$nextTick();
        const options = wrapper.vm.currentOptions;
        expect(options[0].label).toBe("-- Clear Selection --");
    });

    test("applies extension filter", async () => {
        const wrapper = mountComponent({ extension: "bed" });
        await wrapper.vm.$nextTick();
        expect(mockGet).toHaveBeenCalled();
        const calledUrl = mockGet.mock.calls[0][0];
        expect(calledUrl).toContain("extension-eq");
        expect(calledUrl).toContain("bed");
    });

    test("shows selected dataset name", async () => {
        const wrapper = mountComponent({
            value: { id: "1", name: "dataset1.csv" },
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectValue).toBe("dataset1.csv");
        await wrapper.setProps({ value: { id: "100", name: "dataset100.csv" } });
        expect(wrapper.vm.selectValue).toBe("dataset100.csv");
    });

    test("shows warning if not optional and no selection", async () => {
        const wrapper = mountComponent({ optional: false });
        wrapper.vm.currentValue = null;
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toContain("Please select a dataset");
    });

    test("emits update on selection", async () => {
        const wrapper = mountComponent();
        wrapper.vm.selectValue = { id: "1", name: "dataset1.csv" };
        wrapper.vm.onUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.currentValue).toEqual({ id: "1", name: "dataset1.csv" });
    });

    test("shows correct name on initialization", async () => {
        const wrapper = mountComponent({ value: { id: "1", name: "dataset1.csv" } });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectValue).toEqual("dataset1.csv");
        wrapper.vm.currentValue = undefined;
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.selectValue).toEqual(null);
    });
});
