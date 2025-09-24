import { describe, test, expect, vi, afterEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import InputSelect from "@/components/InputSelect.vue";
import { NSelect } from "naive-ui";

describe("InputSelect.vue", () => {
    const options = [
        { label: "Option 1", value: { id: "1", name: "A", active: true } },
        { label: "Option 2", value: { id: "2", name: "B", active: false } },
    ];

    const mountComponent = (props = {}) =>
        mount(InputSelect, {
            props: {
                datasetId: "123",
                options,
                optional: false,
                ...props,
            },
        });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("renders options correctly", async () => {
        const wrapper = mountComponent();
        await flushPromises();
        const selectOptions = wrapper.vm.mapped;
        expect(selectOptions.length).toBe(2);
        expect(selectOptions[0].label).toBe("Option 1");
        expect(selectOptions[1].label).toBe("Option 2");
    });

    test("handles optional value", async () => {
        const wrapper = mountComponent({ optional: true });
        await flushPromises();
        const selectOptions = wrapper.vm.mapped;
        expect(selectOptions[0].label).toBe("-- Clear Selection --");
        expect(selectOptions.length).toBe(3);
    });

    test("updates currentValue when selection changes", async () => {
        const wrapper = mountComponent();
        await flushPromises();
        wrapper.vm.onUpdate("2");
        expect(wrapper.vm.currentValue).toEqual({ id: "2", name: "B", active: false });
        expect(wrapper.vm.selectValue).toBe("2");
        wrapper.vm.onUpdate("");
        expect(wrapper.vm.currentValue).toBeNull();
        expect(wrapper.vm.selectValue).toBe("");
    });

    test("shows warning if not optional and no selection", async () => {
        const wrapper = mountComponent({ optional: false });
        wrapper.vm.currentValue = null;
        await flushPromises();
        expect(wrapper.html()).toContain("Please select a value.");
    });

    test("emits search events", async () => {
        const wrapper = mountComponent();
        const searchTerm = "query";
        const select = wrapper.findComponent(NSelect);
        await select.vm.$emit("search", searchTerm);
        expect(wrapper.emitted("search")?.[0]).toEqual([searchTerm]);
    });
});
