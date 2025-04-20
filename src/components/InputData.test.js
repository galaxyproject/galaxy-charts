import { describe, test, expect, vi, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import InputData from "@/components/InputData.vue";

// Shared Galaxy API mock
const mockGet = vi.fn().mockResolvedValue({
    data: [
        { id: "1", name: "dataset1.csv" },
        { id: "2", name: "dataset2.csv" },
    ],
});

vi.mock("@/api/client", () => ({
    GalaxyApi: () => ({
        GET: mockGet,
    }),
}));

describe("InputData.vue", () => {
    let wrapper;

    const mountComponent = (props = {}) => {
        wrapper = mount(InputData, {
            props: {
                optional: false,
                ...props,
            },
        });
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("loads datasets on mount", async () => {
        mountComponent();
        await flushPromises();
        await wrapper.vm.$nextTick();
        const options = wrapper.vm.currentOptions;
        expect(mockGet).toHaveBeenCalled();
        expect(options.length).toBe(3); // 2 datasets + disabled "filter for more"
        expect(options[0].label).toBe("dataset1.csv");
    });

    test("adds clear option if optional", async () => {
        mountComponent({ optional: true });
        await flushPromises();
        await wrapper.vm.$nextTick();
        const options = wrapper.vm.currentOptions;
        expect(options[0].label).toBe("-- Clear Selection --");
    });

    test("applies extension filter", async () => {
        mountComponent({ extension: "bed" });
        await flushPromises();
        await wrapper.vm.$nextTick();
        expect(mockGet).toHaveBeenCalled();
        const calledUrl = mockGet.mock.calls[0][0];
        expect(calledUrl).toContain("extension-eq");
        expect(calledUrl).toContain("bed");
    });

    test("shows selected dataset name", async () => {
        mountComponent();
        wrapper.vm.currentValue = { id: "1", name: "dataset1.csv" };
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toContain("Selected: dataset1.csv");
    });

    test("shows warning if not optional and no selection", async () => {
        mountComponent({ optional: false });
        wrapper.vm.currentValue = null;
        await wrapper.vm.$nextTick();
        expect(wrapper.html()).toContain("Please select a dataset");
    });

    test("emits update on selection", async () => {
        mountComponent();
        await flushPromises();
        wrapper.vm.selectValue = { id: "1", name: "dataset1.csv" };
        wrapper.vm.onUpdate();
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.currentValue).toEqual({ id: "1", name: "dataset1.csv" });
    });
});
