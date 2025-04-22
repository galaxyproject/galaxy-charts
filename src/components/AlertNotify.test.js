import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import Component from "@/components/AlertNotify.vue";
import { NAlert } from "naive-ui";

vi.useFakeTimers();

describe("Message Alert", () => {
    let wrapper;
    const timeoutSpy = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        wrapper = mount(Component, {
            props: {
                message: "",
                onTimeout: timeoutSpy,
            },
        });
    });

    it("emits timeout after delay", async () => {
        await wrapper.setProps({ message: "Test Message" });
        expect(wrapper.findComponent(NAlert).exists()).toBe(true);
        vi.advanceTimersByTime(2000);
        await wrapper.vm.$nextTick();
        expect(timeoutSpy).toHaveBeenCalled();
    });

    it("resets timer on message change", async () => {
        await wrapper.setProps({ message: "First" });
        await wrapper.vm.$nextTick();
        await wrapper.setProps({ message: "Second" });
        await wrapper.vm.$nextTick();
        vi.advanceTimersByTime(1999);
        expect(timeoutSpy).not.toHaveBeenCalled();
        vi.advanceTimersByTime(1);
        await wrapper.vm.$nextTick();
        expect(timeoutSpy).toHaveBeenCalled();
    });

    it("hides alert when message is cleared", async () => {
        await wrapper.setProps({ message: "Visible Message" });
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(NAlert).exists()).toBe(true);
        await wrapper.setProps({ message: "" });
        await wrapper.vm.$nextTick();
        expect(wrapper.findComponent(NAlert).exists()).toBe(false);
    });
});
