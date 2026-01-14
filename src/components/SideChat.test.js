import { describe, test, expect, vi, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
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
                SideMessage,
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
        expect(wrapper.findAllComponents(SideMessage).length).toBe(3);
    });

    test("emits full transcript snapshot on user message", async () => {
        const wrapper = mountTarget([]);
        wrapper.vm.userInput = "Hello";
        await wrapper.vm.onInput();
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
        await wrapper.vm.onInput();
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
        await wrapper.vm.onInput();
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

    describe("arrow key history navigation", () => {
        test("arrow up shows most recent user message", () => {
            const wrapper = mountTarget([
                { role: "user", content: "first" },
                { role: "assistant", content: "response" },
                { role: "user", content: "second" },
            ]);
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("second");
        });

        test("arrow up cycles through history oldest to newest", () => {
            const wrapper = mountTarget([
                { role: "user", content: "first" },
                { role: "user", content: "second" },
                { role: "user", content: "third" },
            ]);
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("third");
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("second");
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("first");
        });

        test("arrow up stops at oldest message", () => {
            const wrapper = mountTarget([{ role: "user", content: "only" }]);
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("only");
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("only");
        });

        test("arrow down returns to newer messages", () => {
            const wrapper = mountTarget([
                { role: "user", content: "first" },
                { role: "user", content: "second" },
            ]);
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("first");
            wrapper.vm.onKeydown({ key: "ArrowDown", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("second");
        });

        test("arrow down returns to draft at bottom", () => {
            const wrapper = mountTarget([{ role: "user", content: "old" }]);
            wrapper.vm.userInput = "my draft";
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("old");
            wrapper.vm.onKeydown({ key: "ArrowDown", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("my draft");
        });

        test("arrow down does nothing when already at draft", () => {
            const wrapper = mountTarget([{ role: "user", content: "old" }]);
            wrapper.vm.userInput = "current";
            wrapper.vm.onKeydown({ key: "ArrowDown", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("current");
        });

        test("history resets after submitting a message", async () => {
            const wrapper = mountTarget([
                { role: "user", content: "old" },
                { role: "assistant", content: "response" },
            ]);
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("old");
            wrapper.vm.userInput = "new message";
            await wrapper.vm.onInput();
            expect(wrapper.vm.historyIndex).toBe(-1);
            expect(wrapper.vm.draftMessage).toBe("");
        });

        test("arrow keys do nothing when no user messages exist", () => {
            const wrapper = mountTarget([{ role: "assistant", content: "hello" }]);
            wrapper.vm.userInput = "typing";
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("typing");
        });

        test("filters out non-string user content", () => {
            const wrapper = mountTarget([
                { role: "user", content: "text message" },
                { role: "user", content: { schema: "data", payload: {} } },
            ]);
            wrapper.vm.onKeydown({ key: "ArrowUp", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("text message");
        });

        test("filters out empty user messages", () => {
            const wrapper = mountTarget([
                { role: "user", content: "valid" },
                { role: "user", content: "   " },
                { role: "user", content: "" },
            ]);
            expect(wrapper.vm.userMessages).toEqual(["valid"]);
        });

        test("ignores non-arrow keys", () => {
            const wrapper = mountTarget([{ role: "user", content: "old" }]);
            wrapper.vm.userInput = "current";
            wrapper.vm.onKeydown({ key: "a", preventDefault: vi.fn() });
            expect(wrapper.vm.userInput).toBe("current");
        });
    });
});
