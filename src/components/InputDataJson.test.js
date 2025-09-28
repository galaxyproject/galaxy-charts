import { describe, test, expect, vi, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import InputDataJson from "@/components/InputDataJson.vue";

const mockFetch = vi.fn();

describe("InputDataJson.vue", () => {
    const mountComponent = (props = {}) =>
        mount(InputDataJson, {
            props: {
                url: "/mock/url",
                optional: false,
                ...props,
            },
        });

    beforeEach(() => {
        mockFetch.mockReset();
        global.fetch = mockFetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
        vi.resetModules();
    });

    test("loads datasets on mount", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => [
                { id: "1", name: "Entry 1" },
                { id: "2", name: "Entry 2" },
            ],
        });
        const wrapper = mountComponent();
        await flushPromises();
        await wrapper.vm.$nextTick();
        const options = wrapper.vm.currentOptions;
        expect(mockFetch).toHaveBeenCalledWith("/mock/url");
        expect(options.length).toBe(2);
        expect(options[0].label).toBe("Entry 1");
    });

    test("handles fetch error gracefully", async () => {
        mockFetch.mockResolvedValue({
            ok: false,
            status: 500,
        });
        const wrapper = mountComponent({ url: "/mock/url_error" });
        await flushPromises();
        expect(wrapper.vm.currentOptions.length).toBe(0);
    });

    test("handles exception during fetch", async () => {
        mockFetch.mockRejectedValue(new Error("Network Error Test"));
        const wrapper = mountComponent({ url: "/mock/url_error" });
        await flushPromises();
        expect(wrapper.vm.currentOptions.length).toBe(0);
    });

    test("shows selected dataset name", async () => {
        mockFetch.mockResolvedValue({
            ok: true,
            json: async () => [{ id: "1", name: "Entry 1" }],
        });
        const wrapper = mountComponent({
            value: { id: "1", name: "Entry 1" },
        });
        await flushPromises();
        expect(wrapper.vm.currentValue?.name).toBe("Entry 1");
        await wrapper.setProps({ value: { id: "100", name: "Entry 100" } });
        expect(wrapper.vm.currentValue?.name).toBe("Entry 100");
    });
});
