import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import InputForm from "@/components/InputForm.vue";
import { NColorPicker, NInput, NInputNumber, NSelect, NSlider, NSwitch } from "naive-ui";
import InputConditional from "@/components/InputConditional.vue";
import InputData from "@/components/InputData.vue";
import InputDataColumn from "@/components/InputDataColumn.vue";
import { toBoolean } from "@/utilities/toBoolean";

// Mock external API calls
vi.mock("@/components/InputData.vue", () => ({
    default: {
        template: "<div></div>",
        props: ["value", "extension", "optional"],
    },
}));

vi.mock("@/components/InputDataColumn.vue", () => ({
    default: {
        template: "<div></div>",
        props: ["value", "datasetId", "isAuto", "isText", "isNumber"],
    },
}));

vi.mock("@/utilities/toBoolean", () => ({
    toBoolean: vi.fn((val) => Boolean(val)),
}));

describe("InputForm.vue", () => {
    let wrapper;

    const props = {
        datasetId: "dataset-123",
        inputs: [
            { name: "booleanInput", type: "boolean" },
            { name: "colorInput", type: "color" },
            {
                name: "conditionalInput",
                type: "conditional",
                test_param: { name: "modeType", type: "string", data: [{ label: "Advanced", value: "advanced" }] },
                cases: [{ value: "advanced", inputs: [{ name: "speed", type: "float", value: "10" }] }],
            },
            { name: "dataInput", type: "data", extension: "csv", optional: "true" },
            { name: "dataColumnInput", type: "data_column", is_auto: "true", is_text: "false", is_number: "true" },
            { name: "floatInput", type: "float", min: 0, max: 100 },
            { name: "selectInput", type: "select", data: [{ label: "Option 1", value: "opt1" }] },
            { name: "textareaInput", type: "textarea", rows: 3 },
            { name: "textInput", type: "text" },
        ],
        values: {
            booleanInput: true,
            colorInput: "#ff0000",
            conditionalInput: { modeType: "advanced", speed: 10 },
            dataInput: { filename: "file.csv" }, // FIXED: Use an object instead of string
            dataColumnInput: "column_name",
            floatInput: 50,
            selectInput: "opt1",
            textareaInput: "This is a test.",
            textInput: "Text Value",
        },
    };

    beforeEach(() => {
        wrapper = mount(InputForm, {
            propsData: { ...props },
            global: {
                components: {
                    NColorPicker,
                    NInput,
                    NInputNumber,
                    NSelect,
                    NSlider,
                    NSwitch,
                    InputConditional,
                    InputData,
                    InputDataColumn,
                },
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("renders all input elements correctly", () => {
        expect(wrapper.findComponent(NSwitch).exists()).toBe(true);
        expect(wrapper.findComponent(NColorPicker).exists()).toBe(true);
        expect(wrapper.findComponent(InputConditional).exists()).toBe(true);
        expect(wrapper.findComponent(InputData).exists()).toBe(true);
        expect(wrapper.findComponent(InputDataColumn).exists()).toBe(true);
        expect(wrapper.findComponent(NSlider).exists()).toBe(true);
        expect(wrapper.findComponent(NInputNumber).exists()).toBe(true);
        expect(wrapper.findComponent(NSelect).exists()).toBe(true);
        expect(wrapper.findComponent(NInput).exists()).toBe(true);
    });

    test("handles updates correctly for conditional inputs", async () => {
        const conditional = wrapper.findComponent(InputConditional);
        await conditional.vm.$emit("update:value", { modeType: "advanced", speed: 20 });
        expect(wrapper.emitted("update:values")).toBeTruthy();
        expect(wrapper.emitted("update:values")[0][0].conditionalInput).toEqual({ modeType: "advanced", speed: 20 });
    });

    test("emits 'update:values' when boolean input changes", async () => {
        const switchInput = wrapper.findComponent(NSwitch);
        await switchInput.vm.$emit("update:value", false);
        expect(wrapper.emitted("update:values")[0][0].booleanInput).toBe(false);
    });

    test("emits 'update:values' when color picker changes", async () => {
        const colorPicker = wrapper.findComponent(NColorPicker);
        await colorPicker.vm.$emit("update:value", "#00ff00");
        expect(wrapper.emitted("update:values")[0][0].colorInput).toBe("#00ff00");
    });

    test("emits 'update:values' when slider changes", async () => {
        const slider = wrapper.findComponent(NSlider);
        await slider.vm.$emit("update:value", 75);
        expect(wrapper.emitted("update:values")[0][0].floatInput).toBe(75);
    });

    test("emits 'update:values' when input number changes", async () => {
        const inputNumbers = wrapper.findAllComponents(NInputNumber);
        expect(inputNumbers.length).toBe(2);
        const inputNumber = inputNumbers.at(1);
        const inputField = inputNumber.find("input");
        await inputField.setValue("42");
        expect(wrapper.emitted("update:values")).toBeTruthy();
        expect(wrapper.emitted("update:values").pop()[0].floatInput).toBe(42);
    });

    test("emits 'update:values' when select input changes", async () => {
        const selectInput = wrapper.findComponent(NSelect);
        await selectInput.vm.$emit("update:value", "opt1");
        expect(wrapper.emitted("update:values")[0][0].selectInput).toBe("opt1");
    });

    test("updates local values when props change", async () => {
        await wrapper.setProps({ values: { textInput: "New Value" } });
        expect(wrapper.vm.currentValues.textInput).toBe("New Value");
    });

    test("sets default values when props.values is undefined", async () => {
        await wrapper.setProps({ values: undefined });
        expect(wrapper.vm.currentValues).toEqual({
            booleanInput: null,
            colorInput: null,
            conditionalInput: {},
            dataInput: null,
            dataColumnInput: null,
            floatInput: null,
            selectInput: null,
            textareaInput: null,
            textInput: null,
        });
    });

    test("ensures boolean inputs correctly convert with toBoolean", async () => {
        expect(toBoolean).toHaveBeenCalledWith("true");
        expect(toBoolean).toHaveBeenCalledWith("false");
    });

    test("emits 'update:values' when integer input changes", async () => {
        await wrapper.setProps({
            inputs: [...props.inputs, { name: "integerInput", type: "integer", min: 1, max: 10 }],
            values: {
                ...props.values,
                integerInput: 5,
            },
        });
        const inputNumbers = wrapper.findAllComponents(NInputNumber);
        const integerInput = inputNumbers.at(-1);
        const inputField = integerInput.find("input");
        await inputField.setValue("7");
        await inputField.trigger("change");
        const emitted = wrapper.emitted("update:values");
        expect(emitted).toBeTruthy();
        const lastEmitted = emitted[emitted.length - 1][0];
        expect(lastEmitted.integerInput).toBe(7);
    });

    test("renders fallback n-input for unknown input type", async () => {
        await wrapper.setProps({
            inputs: [{ name: "customInput", type: "custom-type" }],
            values: { customInput: "abc" },
        });
        const inputs = wrapper.findAllComponents(NInput);
        expect(inputs.at(-1).exists()).toBe(true);
    });

    test("sets null if a value is missing from props.values", async () => {
        await wrapper.setProps({
            inputs: [{ name: "missingInput", type: "text" }],
            values: {},
        });
        expect(wrapper.vm.currentValues.missingInput).toBeNull();
    });

    test("emits 'update:values' when textarea input changes", async () => {
        const textarea = wrapper.find("textarea");
        await textarea.setValue("Updated textarea");
        expect(wrapper.emitted("update:values")).toBeTruthy();
        expect(wrapper.emitted("update:values").pop()[0].textareaInput).toBe("Updated textarea");
    });

    test("passes isAuto, isText, isNumber to InputDataColumn", () => {
        const colInput = wrapper.findComponent(InputDataColumn);
        expect(colInput.props("isAuto")).toBe(true);
        expect(colInput.props("isText")).toBe(true);
        expect(colInput.props("isNumber")).toBe(true);
    });

    test("reinitializes values reactively when props.values changes", async () => {
        await wrapper.setProps({ values: { textInput: "Reset Value" } });
        expect(wrapper.vm.currentValues.textInput).toBe("Reset Value");
    });

    test("select input handles unknown option gracefully", async () => {
        await wrapper.setProps({
            values: { selectInput: "unknown" },
        });
        const select = wrapper.findComponent(NSelect);
        expect(select.props("value")).toBe(undefined);
    });

    test("calls initialValues and populates defaults when values are undefined", async () => {
        const localInputs = [
            { name: "inputA", type: "text" },
            { name: "inputB", type: "float", min: 0, max: 10 },
        ];

        const localWrapper = mount(InputForm, {
            propsData: {
                datasetId: "ds1",
                inputs: localInputs,
                values: undefined,
            },
            global: {
                components: {
                    NInput,
                    NSlider,
                    NInputNumber,
                },
            },
        });

        expect(localWrapper.vm.currentValues).toEqual({
            inputA: null,
            inputB: null,
        });

        expect(localWrapper.findComponent(NInput).exists()).toBe(true);
        expect(localWrapper.findComponent(NInputNumber).exists()).toBe(true);
    });
});
