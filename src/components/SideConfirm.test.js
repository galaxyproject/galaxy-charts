import { describe, test, expect } from "vitest";
import { mount } from "@vue/test-utils";
import SideConfirm from "@/components/SideConfirm.vue";
import SideButton from "@/components/SideButton.vue";

function mountTarget(props = {}) {
    return mount(SideConfirm, {
        props: {
            content: "Are you sure?",
            ...props,
        },
        global: {
            components: {
                SideButton,
            },
        },
    });
}

describe("SideConfirm.vue", () => {
    test("renders confirm content", () => {
        const wrapper = mountTarget({ content: "Confirm action" });
        expect(wrapper.text()).toContain("Confirm action");
    });

    test("emits accept event on accept button click", async () => {
        const wrapper = mountTarget();
        const buttons = wrapper.findAllComponents(SideButton);
        expect(buttons.length).toBe(2);
        await buttons[0].vm.$emit("click");
        expect(wrapper.emitted("accept")).toBeTruthy();
        expect(wrapper.emitted("accept")?.length).toBe(1);
    });

    test("emits reject event on reject button click", async () => {
        const wrapper = mountTarget();
        const buttons = wrapper.findAllComponents(SideButton);
        await buttons[1].vm.$emit("click");
        expect(wrapper.emitted("reject")).toBeTruthy();
        expect(wrapper.emitted("reject")?.length).toBe(1);
    });
});
