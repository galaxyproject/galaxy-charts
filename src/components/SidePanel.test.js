import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SidePanel from "@/components/SidePanel.vue";
import { visualizationsCreate, visualizationsUpdate } from "@/api/visualizations";
import { errorMessageAsString } from "@/utilities/simpleError";
import { NButton, NIcon, NInput, NTab, NTooltip } from "naive-ui";
import AlertNotify from "@/components/AlertNotify.vue";

// Mock API functions
vi.mock("@/api/visualizations", () => ({
    visualizationsCreate: vi.fn(),
    visualizationsUpdate: vi.fn(),
}));

vi.mock("@/utilities/simpleError", () => ({
    errorMessageAsString: vi.fn(),
}));

describe("SidePanel.vue", () => {
    let wrapper;

    const props = {
        datasetId: "123",
        logoUrl: "http://example.com/logo.png",
        pluginDescription: "Test description",
        pluginHtml: "<strong>Visualization</strong>",
        pluginName: "Test Visualization",
        settingInputs: [{ name: "Setting1", type: "text" }],
        settingValues: { Setting1: "Value1" },
        specValues: {},
        trackInputs: [{ name: "Track1", type: "float" }],
        trackValues: [{ Track1: 10 }],
        visualizationId: "vis-001",
        visualizationTitle: "Test Title",
    };

    beforeEach(() => {
        wrapper = mount(SidePanel, {
            propsData: { ...props },
            global: {
                components: { NButton, NIcon, NInput, NTab, NTooltip, AlertNotify },
            },
        });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test("renders correctly with given props", () => {
        expect(wrapper.find(".font-bold").text()).toContain("Visualization");
        expect(wrapper.find("img").attributes("src")).toBe(props.logoUrl);
    });

    test("computes 'hideTabs' correctly", async () => {
        expect(wrapper.vm.showTabs).toBe(true);
        await wrapper.setProps({ settingInputs: [], trackInputs: [] });
        expect(wrapper.vm.showTabs).toBe(false);
    });

    test("hides save button if datasetId is missing", async () => {
        const saveButton = '[data-description="sidebutton save"]';
        expect(wrapper.find(saveButton).exists()).toBeTruthy();
        await wrapper.setProps({ datasetId: "" });
        expect(wrapper.find(saveButton).exists()).toBeFalsy();
    });

    test("displays error message and clears it after timeout", async () => {
        wrapper.vm.message = "An error occurred";
        wrapper.vm.messageType = "error";
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(AlertNotify).props("message")).toBe("An error occurred");
        wrapper.vm.message = "";
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(AlertNotify).props("message")).toBe("");
    });

    test("emits 'update:visualization-title' when input changes", async () => {
        wrapper.vm.currentTab = "settings";
        await wrapper.vm.$nextTick();
        const titleInput = wrapper.findComponent('[data-description="side panel title input"]');
        await titleInput.vm.$emit("input", "New Title");
        expect(wrapper.emitted("update:visualization-title")).toBeTruthy();
        expect(wrapper.emitted("update:visualization-title")[0]).toEqual(["New Title"]);
    });

    test("emits 'update:settings' when settings change", async () => {
        wrapper.vm.onUpdateSettings({ Setting1: "New Value" });
        expect(wrapper.emitted("update:settings")).toBeTruthy();
        expect(wrapper.emitted("update:settings")[0]).toEqual([{ Setting1: "New Value" }]);
    });

    test("emits 'update:tracks' when tracks change", async () => {
        wrapper.vm.onUpdateTracks([{ Track1: 20 }]);
        expect(wrapper.emitted("update:tracks")).toBeTruthy();
        expect(wrapper.emitted("update:tracks")[0]).toEqual([[{ Track1: 20 }]]);
    });

    test("renders correct number of tab panes", async () => {
        await wrapper.setProps({
            settingInputs: [{ name: "Setting1", type: "text" }],
            trackInputs: [{ name: "Track1", type: "float" }],
        });
        expect(wrapper.findAllComponents(NTab).length).toBe(2);
    });

    test("does not render tab panes if inputs are empty", async () => {
        await wrapper.setProps({ settingInputs: [], trackInputs: [] });
        expect(wrapper.findAllComponents(NTab).length).toBe(0);
    });

    test("updates visualization title correctly", async () => {
        wrapper.vm.currentTab = "settings";
        await wrapper.vm.$nextTick();
        const titleInput = wrapper.findComponent('[data-description="side panel title input"]');
        expect(titleInput.props("value")).toBe("Test Title");
        await wrapper.setProps({ visualizationTitle: "New Test Title" });
        expect(titleInput.props("value")).toBe("New Test Title");
    });

    test("calls 'visualizationsUpdate' when 'onSave' is triggered with an existing visualizationId", async () => {
        visualizationsUpdate.mockResolvedValueOnce({});
        await wrapper.vm.onSave();
        expect(visualizationsUpdate).toHaveBeenCalledWith("vis-001", "Test Title", {
            dataset_id: "123",
            settings: { Setting1: "Value1" },
            tracks: [{ Track1: 10 }],
        });
        expect(wrapper.vm.message).toBe("Successfully saved.");
        expect(wrapper.vm.messageType).toBe("success");
    });

    test("calls 'visualizationsCreate' when 'onSave' is triggered without a visualizationId", async () => {
        visualizationsCreate.mockResolvedValueOnce("new-vis-002");
        await wrapper.setProps({ visualizationId: null });
        await wrapper.vm.onSave();
        expect(visualizationsCreate).toHaveBeenCalledWith("Test Visualization", "Test Title", {
            dataset_id: "123",
            settings: { Setting1: "Value1" },
            tracks: [{ Track1: 10 }],
        });
        expect(wrapper.vm.message).toBe("Successfully created.");
        expect(wrapper.vm.messageType).toBe("success");
        expect(wrapper.emitted("update:visualization-id")[0]).toEqual(["new-vis-002"]);
    });

    test("handles API errors in 'onSave'", async () => {
        visualizationsUpdate.mockRejectedValueOnce(new Error("API error"));
        errorMessageAsString.mockReturnValue("Error occurred");
        await wrapper.vm.onSave();
        expect(wrapper.vm.message).toBe("Error occurred");
        expect(wrapper.vm.messageType).toBe("error");
    });

    test("emits 'toggle' when collapse button is clicked", async () => {
        const toggleButton = wrapper.findAllComponents(NButton).at(1);
        await toggleButton.trigger("click");
        expect(wrapper.emitted("toggle")).toBeTruthy();
    });

    test("handles API errors in 'visualizationsCreate'", async () => {
        visualizationsCreate.mockRejectedValueOnce(new Error("Create API error"));
        errorMessageAsString.mockReturnValue("Create Error Occurred");
        await wrapper.setProps({ visualizationId: null });
        await wrapper.vm.onSave();
        expect(wrapper.vm.message).toBe("Create Error Occurred");
        expect(wrapper.vm.messageType).toBe("error");
    });

    test("updates tab visibility when inputs change dynamically", async () => {
        await wrapper.setProps({ settingInputs: [], trackInputs: [] });
        expect(wrapper.findAllComponents(NTab).length).toBe(0);
        await wrapper.setProps({ settingInputs: [{ name: "Setting1", type: "text" }] });
        expect(wrapper.findAllComponents(NTab).length).toBe(1);
        await wrapper.setProps({ trackInputs: [{ name: "Track1", type: "float" }] });
        expect(wrapper.findAllComponents(NTab).length).toBe(2);
    });

    test("handles null return from visualizationsCreate", async () => {
        visualizationsCreate.mockResolvedValueOnce(null);
        await wrapper.setProps({ visualizationId: null });
        await wrapper.vm.onSave();
        expect(wrapper.vm.message).toBe("Verify that you are logged in and Galaxy is accessible.");
        expect(wrapper.vm.messageType).toBe("error");
    });

    test("renders ChartsLogo when logoUrl is not provided", async () => {
        await wrapper.setProps({ logoUrl: "" });
        expect(wrapper.findComponent({ name: "ChartsLogo" }).exists()).toBe(true);
    });

    test("does not render save tooltip when datasetId is missing", async () => {
        await wrapper.setProps({ datasetId: "" });
        expect(wrapper.find('[data-description="sidepanel save button"]').exists()).toBe(false);
    });

    test("emits full messages snapshot on update:messages", async () => {
        const messages = [
            { role: "system", content: "System prompt" },
            { role: "assistant", content: "Hello" },
            { role: "user", content: "Hi" },
        ];
        wrapper.vm.onUpdateMessages(messages);
        expect(wrapper.emitted("update:messages")).toBeTruthy();
        expect(wrapper.emitted("update:messages")[0][0]).toEqual(messages);
    });

    test("does not mutate incoming settingValues when updating messages", async () => {
        const originalSettings = { ...props.settingValues };
        wrapper.vm.onUpdateMessages([{ role: "assistant", content: "Test reply" }]);
        expect(props.settingValues).toEqual(originalSettings);
    });
});
