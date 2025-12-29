import { describe, test, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import AlertNotify from "@/components/AlertNotify.vue";
import SideChat from "@/components/SideChat.vue";
import SideMessage from "@/components/SideMessage.vue";
import { NButton, NIcon, NInput } from "naive-ui";

function mountTarget(transcripts = []) {
    return mount(SideChat, {
        props: {
            transcripts,
        },
        global: {
            components: {
                NButton,
                NIcon,
                NInput,
                AlertNotify,
                SideMessage,
            },
        },
    });
}

describe("SideChat.vue", () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test("renders provided transcripts", () => {
        const transcripts = [
            { role: "assistant", content: "hello" },
            { role: "user", content: "hi" },
        ];
        const wrapper = mountTarget(transcripts);
        expect(wrapper.findAllComponents(SideMessage).length).toBe(3);
    });

    test("emits full transcript snapshot on user message", async () => {
        const wrapper = mountTarget([]);
        wrapper.vm.userInput = "Hello";
        await wrapper.vm.onMessage();
        const emitted = wrapper.emitted("update:transcripts");
        expect(emitted).toBeTruthy();
        const snapshot = emitted[0][0];
        expect(snapshot.length).toBe(1);
        expect(snapshot[0].role).toBe("user");
        expect(snapshot[0].content).toBe("Hello");
    });

    test("does not emit when input is empty", async () => {
        const wrapper = mountTarget([]);
        wrapper.vm.userInput = "   ";
        await wrapper.vm.onMessage();
        expect(wrapper.emitted("update:transcripts")).toBeUndefined();
    });

    test("reset emits empty transcript", async () => {
        const wrapper = mountTarget([{ role: "user", content: "hi" }]);
        wrapper.vm.onReset();
        const emitted = wrapper.emitted("update:transcripts");
        expect(emitted).toBeTruthy();
        expect(emitted[0][0]).toEqual([]);
    });

    test("does not mutate incoming transcripts", async () => {
        const original = [{ role: "assistant", content: "x" }];
        const wrapper = mountTarget(original);
        wrapper.vm.userInput = "y";
        await wrapper.vm.onMessage();
        expect(original).toEqual([{ role: "assistant", content: "x" }]);
    });

    test("thinking state true when last role is user", async () => {
        const wrapper = mountTarget([{ role: "user", content: "pending" }]);
        expect(wrapper.vm.isThinking).toBe(true);
    });

    test("thinking state false when last role is assistant", async () => {
        const wrapper = mountTarget([{ role: "assistant", content: "done" }]);
        expect(wrapper.vm.isThinking).toBe(false);
    });
});
