import { describe, test, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import InputConditional from "@/components/inputs/InputConditional.vue";
import InputForm from "@/components/inputs/InputForm.vue";
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
            props: { datasetId, input: booleanInput, value: { modeType: "true" } },
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
            "The conditional 'mode' is missing cases.",
        );
    });

    test("restores nested conditional defaults when switching parent conditional", async () => {
        const wrapper = mount(InputConditional, {
            props: {
                datasetId,
                input: {
                    name: "conditional_0",
                    type: "conditional",
                    test_param: {
                        name: "conditional_0",
                        type: "string",
                        value: "a_0",
                        data: [
                            { label: "Condition A", value: "a_0" },
                            { label: "Condition B", value: "b_0" },
                        ],
                    },
                    cases: [
                        {
                            value: "a_0",
                            inputs: [
                                {
                                    name: "conditional_1",
                                    type: "conditional",
                                    test_param: {
                                        name: "condition_1",
                                        type: "string",
                                        value: "a_1",
                                        data: [
                                            { label: "Condition A", value: "a_1" },
                                            { label: "Condition B", value: "b_1" },
                                        ],
                                    },
                                    cases: [
                                        {
                                            value: "a_1",
                                            inputs: [
                                                { name: "float_a_1", type: "float", value: "1.0" },
                                                {
                                                    name: "conditional_2",
                                                    type: "conditional",
                                                    test_param: {
                                                        name: "condition_2",
                                                        type: "string",
                                                        value: "a_2",
                                                        data: [
                                                            { label: "Condition A", value: "a_2" },
                                                            { label: "Condition B", value: "b_2" },
                                                        ],
                                                    },
                                                    cases: [
                                                        {
                                                            value: "a_2",
                                                            inputs: [
                                                                { name: "float_a_2", type: "float", value: "2.0" },
                                                            ],
                                                        },
                                                        {
                                                            value: "b_2",
                                                            inputs: [
                                                                { name: "float_b_2", type: "float", value: "20.0" },
                                                            ],
                                                        },
                                                    ],
                                                },
                                            ],
                                        },
                                        {
                                            value: "b_1",
                                            inputs: [{ name: "float_b_1", type: "float", value: "10.0" }],
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            value: "b",
                            inputs: [{ name: "float_b_0", type: "float", value: "5.0" }],
                        },
                    ],
                },
            },
        });

        wrapper.findComponent(NSelect).vm.$emit("update:value", "b");
        await wrapper.vm.$nextTick();
        const emitted = wrapper.emitted("update:value");
        expect(emitted).toBeTruthy();
        const lastEmitted = emitted[emitted.length - 1][0];
        expect(lastEmitted).toEqual({ float_b_0: 5, conditional_0: "b" });

        wrapper.findComponent(NSelect).vm.$emit("update:value", "a_0");
        await wrapper.vm.$nextTick();
        const emittedA = wrapper.emitted("update:value");
        expect(emittedA).toBeTruthy();
        const lastEmittedA = emittedA[emittedA.length - 1][0];
        expect(lastEmittedA).toEqual({
            conditional_1: {
                condition_1: "a_1",
                conditional_2: {
                    float_a_2: 2,
                    condition_2: "a_2",
                },
                float_a_1: 1,
            },
            conditional_0: "a_0",
        });
    });

    test("deep nested update propagates correctly", async () => {
        const deepInput = {
            name: "root",
            type: "conditional",
            test_param: {
                name: "root_condition",
                type: "string",
                value: "x",
                data: [
                    { label: "X", value: "x" },
                    { label: "Y", value: "y" },
                ],
            },
            cases: [
                {
                    value: "x",
                    inputs: [
                        {
                            name: "nested_1",
                            type: "conditional",
                            test_param: {
                                name: "nested_condition",
                                type: "string",
                                value: "alpha",
                                data: [
                                    { label: "Alpha", value: "alpha" },
                                    { label: "Beta", value: "beta" },
                                ],
                            },
                            cases: [
                                {
                                    value: "alpha",
                                    inputs: [{ name: "value_alpha", type: "float", value: "11.0" }],
                                },
                                {
                                    value: "beta",
                                    inputs: [{ name: "value_beta", type: "float", value: "22.0" }],
                                },
                            ],
                        },
                    ],
                },
                {
                    value: "y",
                    inputs: [{ name: "root_float", type: "float", value: "99.0" }],
                },
            ],
        };

        const wrapper = mount(InputConditional, {
            props: { datasetId, input: deepInput, value: { root_condition: "x" } },
        });

        // Switch to branch Y and back to X
        wrapper.findComponent(NSelect).vm.$emit("update:value", "y");
        await wrapper.vm.$nextTick();
        const emitted1 = wrapper.emitted("update:value");
        expect(emitted1[emitted1.length - 1][0]).toEqual({ root_float: 99, root_condition: "y" });

        wrapper.findComponent(NSelect).vm.$emit("update:value", "x");
        await wrapper.vm.$nextTick();
        const emitted2 = wrapper.emitted("update:value");
        expect(emitted2[emitted2.length - 1][0]).toEqual({
            nested_1: { nested_condition: "alpha", value_alpha: 11 },
            root_condition: "x",
        });
    });

    test("ignores undefined values when building defaults", async () => {
        const wrapper = mount(InputConditional, {
            props: {
                datasetId,
                input: {
                    ...validInput,
                    cases: [
                        {
                            value: "advanced",
                            inputs: [{ name: "speed", type: "float" }],
                        },
                    ],
                },
                value: { modeType: "advanced" },
            },
        });
        const emitted = wrapper.emitted("update:value");
        expect(emitted).toBeFalsy();
        expect(wrapper.vm.currentInputs).toBeDefined();
    });
});
