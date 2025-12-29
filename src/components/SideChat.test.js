import { describe, test, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SideChat from "@/components/SideChat.vue";
import SideChatMessage from "@/components/SideChatMessage.vue";
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
                SideChatMessage,
            },
        },
    });
}

describe("SideChat.vue", () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test("renders provided transcripts and thinking indicator", () => {
        const transcripts = [
            { role: "assistant", content: "hello" },
            { role: "user", content: "hi" },
        ];
        const wrapper = mountTarget(transcripts);
        expect(wrapper.findAllComponents(SideChatMessage).length).toBe(3);
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

    test("thinking state true when last role is user", () => {
        const wrapper = mountTarget([{ role: "user", content: "pending" }]);
        expect(wrapper.vm.isThinking).toBe(true);
    });

    test("thinking state false when last role is assistant", () => {
        const wrapper = mountTarget([{ role: "assistant", content: "done" }]);
        expect(wrapper.vm.isThinking).toBe(false);
    });

    test("stop emits transcript entry with stop variant", async () => {
        const wrapper = mountTarget([{ role: "user", content: "working" }]);
        await wrapper.vm.onStop();
        const emitted = wrapper.emitted("update:transcripts");
        expect(emitted).toBeTruthy();
        const snapshot = emitted[0][0];
        const last = snapshot[snapshot.length - 1];
        expect(last.role).toBe("user");
        expect(last.variant).toBe("stop");
        expect(last.content).toBe("");
    });

    test("stop does not emit twice in a row", async () => {
        const wrapper = mountTarget([{ role: "user", content: "working", variant: "stop" }]);
        await wrapper.vm.onStop();
        expect(wrapper.emitted("update:transcripts")).toBeUndefined();
    });
});
