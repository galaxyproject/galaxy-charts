import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InputRepeats from "@/components/inputs/InputRepeats.vue";
import InputForm from "@/components/inputs/InputForm.vue";
import { NButton } from "naive-ui";

vi.mock("@/utilities/parseDefaults", () => ({
    parseDefaults: vi.fn(() => ({ speed: "10" })),
}));

describe("InputRepeats Component", () => {
    const datasetId = "dataset-123";
    const inputs = [{ name: "speed", type: "float" }];
    const initialValues = [{ speed: 15 }];

    test("renders correctly with initial values", () => {
        const wrapper = mount(InputRepeats, {
            props: { datasetId, inputs, valuesArray: initialValues },
        });
        expect(wrapper.findComponent(InputForm).exists()).toBe(true);
        expect(wrapper.findComponent(NButton).exists()).toBe(true);
        expect(wrapper.find("span").text()).toContain("Add New Track");
    });

    test("adds a new track when 'Add New Track' is clicked", async () => {
        const wrapper = mount(InputRepeats, {
            props: { datasetId, inputs, valuesArray: [...initialValues] },
        });
        await wrapper.find("button").trigger("click");
        expect(wrapper.emitted("update:values-array")).toBeTruthy();
        expect(wrapper.emitted("update:values-array")[0][0]).toHaveLength(2);
    });

    test("removes a track when 'Remove Track' is clicked", async () => {
        const wrapper = mount(InputRepeats, {
            props: { datasetId, inputs, valuesArray: [{ speed: 15 }, { speed: 20 }, { speed: 25 }] },
        });
        const removeButtonsA = wrapper.findAll('[data-description="remove repeat block"]');
        expect(removeButtonsA.length).toBe(3);
        await removeButtonsA.at(1).trigger("click");
        expect(wrapper.emitted("update:values-array")).toBeTruthy();
        const emittedValuesA = wrapper.emitted("update:values-array")[0][0];
        expect(emittedValuesA).toHaveLength(2);
        expect(emittedValuesA[0].speed).toBe(15);
        expect(emittedValuesA[1].speed).toBe(25);
        await wrapper.setProps({ valuesArray: emittedValuesA });
        const removeButtonsB = wrapper.findAll('[data-description="remove repeat block"]');
        expect(removeButtonsB.length).toBe(2);
        await removeButtonsB.at(0).trigger("click");
        const emittedValuesB = wrapper.emitted("update:values-array")[1][0];
        expect(emittedValuesB).toHaveLength(1);
        expect(emittedValuesB[0].speed).toBe(15);
    });

    test("disables 'Remove Track' button when only one track remains", () => {
        const wrapper = mount(InputRepeats, {
            props: { datasetId, inputs, valuesArray: [...initialValues] },
        });
        const removeButtons = wrapper.findAll('[data-description="remove repeat block"]');
        expect(removeButtons.length).toBe(1);
        expect(removeButtons.at(0).attributes("disabled")).toBeDefined();
    });

    test("updates a track when InputForm emits update", async () => {
        const wrapper = mount(InputRepeats, {
            props: { datasetId, inputs, valuesArray: [...initialValues] },
        });
        await wrapper.findComponent(InputForm).vm.$emit("update:values", { speed: "25" });
        expect(wrapper.emitted("update:values-array")).toBeTruthy();
        expect(wrapper.emitted("update:values-array")[0][0][0].speed).toBe("25");
    });
});
