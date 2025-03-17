import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InputConditional from "@/components/InputConditional.vue";
import InputForm from "@/components/InputForm.vue";
import { NSelect, NSwitch } from "naive-ui";

vi.mock("@/utilities/parseDefaults", () => ({
    parseDefaults: vi.fn(() => ({ speed: "10" })),
}));

describe("InputConditional Component", () => {
    const datasetId = "dataset-123";

    const validInput = {
        name: "mode",
        type: "conditional",
        test_param: { name: "modeType", type: "string", data: [{ label: "Advanced", value: "advanced" }] },
        cases: [
            {
                value: "advanced",
                inputs: [{ name: "speed", type: "float", value: "10" }],
            },
        ],
    };

    test("renders correctly with select input", async () => {
        const wrapper = mount(InputConditional, {
            props: { datasetId, input: validInput, value: { modeType: "advanced" } },
        });
        expect(wrapper.findComponent(NSelect).exists()).toBe(true);
        expect(wrapper.findComponent(InputForm).exists()).toBe(true);
    });

    test("renders correctly with switch input", () => {
        const booleanInput = {
            ...validInput,
            test_param: { name: "modeType", type: "boolean" },
        };
        const wrapper = mount(InputConditional, {
            props: { datasetId, input: booleanInput },
            modelValue: { modeType: "true" },
        });
        expect(wrapper.findComponent(NSwitch).exists()).toBe(true);
    });

    test("updates the test value when selecting an option", () => {
        const wrapper = mount(InputConditional, {
            props: { datasetId, input: validInput, value: { modeType: "advanced" } },
        });
        wrapper.findComponent(NSelect).vm.$emit("update:value", "advanced");
        expect(wrapper.vm.currentTestValue).toBe("advanced");
    });

    test("updates values when InputForm emits changes", async () => {
        const wrapper = mount(InputConditional, {
            props: { datasetId, input: validInput, value: { modeType: "advanced", speed: 10 } },
        });
        await wrapper.findComponent(InputForm).vm.$emit("update:values", { speed: 20 });
        expect(wrapper.emitted("update:value")).toBeTruthy();
        expect(wrapper.emitted("update:value")[0][0].speed).toBe(20);
    });

    test("throws an error if test_param is missing", () => {
        const invalidInput = { ...validInput, test_param: undefined };
        expect(() => mount(InputConditional, { props: { datasetId, input: invalidInput } })).toThrow(
            "The conditional 'mode' is missing a test parameter.",
        );
    });

    test("throws an error if cases are missing", () => {
        const invalidInput = { ...validInput, cases: [] };
        expect(() => mount(InputConditional, { props: { datasetId, input: invalidInput } })).toThrow(
            "The conditional 'mode' is missing a cases.",
        );
    });
});
