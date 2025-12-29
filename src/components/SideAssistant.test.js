import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { mount } from "@vue/test-utils";
import SideAssistant from "@/components/SideAssistant.vue";
import { completionsPost } from "@/api/completions";
import { COMPLETIONS_KEY } from "@/api/completions";
import AlertNotify from "@/components/AlertNotify.vue";
import SideMessage from "@/components/SideMessage.vue";
import { NButton, NIcon, NInput } from "naive-ui";

const DEFAULT_PROMPT = "Respond to user messages.";

vi.mock("@/api/completions", () => ({
    COMPLETIONS_KEY: "__AI_MESSAGES__",
    completionsPost: vi.fn(),
}));

vi.mock("@/store/configStore", () => ({
    useConfigStore: () => ({
        getRoot: () => "/root/",
    }),
}));

function mountTarget(propsData = {}) {
    return mount(SideAssistant, {
        propsData: {
            datasetId: "ds-1",
            pluginName: "test-plugin",
            settings: {},
            specs: {
                ai_api_key: "key",
                ai_model: "model",
            },
            tracks: [],
            ...propsData,
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
describe("SideAssistant.vue", () => {
    afterEach(() => {
        vi.resetAllMocks();
    });

    test("validate provider base url handling", async () => {
        const wrapper = mountTarget({
            specs: {
                ai_prompt: "Custom system prompt",
            },
        });
        expect(wrapper.vm.aiBaseUrl).toBe("/root/api/ai/plugins/test-plugin");
        await wrapper.setProps({ specs: { ai_api_base_url: "http://someother.provider.com" } });
        expect(wrapper.vm.aiBaseUrl).toBe("http://someother.provider.com");
    });

    test("initializes with system and assistant messages", async () => {
        const wrapper = mountTarget();
        const messages = wrapper.vm.messages;
        expect(messages.length).toBe(1);
        expect(messages[0].role).toBe("system");
        expect(messages[0].content).toBe(DEFAULT_PROMPT);
    });

    test("uses ai_prompt from specs when provided", async () => {
        const wrapper = mountTarget({
            specs: {
                ai_prompt: "Custom system prompt",
            },
        });
        const messages = wrapper.vm.messages;
        expect(messages[0].content).toBe("Custom system prompt");
    });

    test("emits full message snapshot on user message", async () => {
        const wrapper = mountTarget();
        completionsPost.mockResolvedValueOnce({ content: "Reply" });
        wrapper.vm.userInput = "Hello";
        await wrapper.vm.onMessage();
        const emitted = wrapper.emitted("update:messages");
        expect(emitted).toBeTruthy();
        const lastEmission = emitted[emitted.length - 1][0];
        expect(Array.isArray(lastEmission)).toBe(true);
        expect(lastEmission[lastEmission.length - 1].role).toBe("assistant");
    });

    test("calls completionsPost with full message history", async () => {
        const wrapper = mountTarget({ specs: { ai_share_state: "true" } });
        completionsPost.mockResolvedValueOnce({ content: "Reply" });
        wrapper.vm.userInput = "Test message";
        await wrapper.vm.onMessage();
        expect(completionsPost).toHaveBeenCalledTimes(1);
        const payload = completionsPost.mock.calls[0][0];
        expect(payload.messages.length).toBeGreaterThan(2);
        expect(payload.messages.at(0).role).toBe("system");
        expect(payload.messages.at(0).content).toContain("user messages");
        expect(payload.messages.at(1).role).toBe("user");
        expect(payload.messages.at(1).content).toContain("state follows");
        expect(payload.messages.at(2).role).toBe("user");
        expect(payload.messages.at(2).content).toContain("Test message");
        expect(payload.messages.at(-1).role).toBe("assistant");
        expect(payload.messages.at(-1).content).toBe("Reply");
    });

    test("calls completionsPost with full message history without state", async () => {
        const wrapper = mountTarget({ specs: { ai_share_state: "false" } });
        completionsPost.mockResolvedValueOnce({ content: "Reply" });
        wrapper.vm.userInput = "Test message";
        await wrapper.vm.onMessage();
        expect(completionsPost).toHaveBeenCalledTimes(1);
        const payload = completionsPost.mock.calls[0][0];
        expect(payload.messages.length).toBeGreaterThan(2);
        expect(payload.messages.at(0).role).toBe("system");
        expect(payload.messages.at(0).content).toContain("user messages");
        expect(payload.messages.at(1).role).toBe("user");
        expect(payload.messages.at(1).content).toContain("Test message");
        expect(payload.messages.at(-1).role).toBe("assistant");
        expect(payload.messages.at(-1).content).toBe("Reply");
    });

    test("does not emit messages when input is empty", async () => {
        const wrapper = mountTarget();
        wrapper.vm.userInput = "   ";
        await wrapper.vm.onMessage();
        expect(wrapper.emitted("update:messages").length).toBe(1);
        expect(completionsPost).not.toHaveBeenCalled();
    });

    test("handles completionsPost errors", async () => {
        const wrapper = mountTarget();
        completionsPost.mockRejectedValueOnce(new Error("API error"));
        wrapper.vm.userInput = "Hello";
        await wrapper.vm.onMessage();
        expect(wrapper.vm.errorMessage).toContain("Error");
    });

    test("reset clears messages and reinitializes", async () => {
        const wrapper = mountTarget();
        wrapper.vm.messages.push({ role: "user", content: "Extra" });
        wrapper.vm.onReset();
        const messages = wrapper.vm.messages;
        expect(messages.length).toBe(1);
        expect(messages[0].role).toBe("system");
    });

    test("loads persisted messages from settings on mount", async () => {
        const persisted = [
            { role: "system", content: "persisted prompt" },
            { role: "assistant", content: "persisted message" },
        ];
        const wrapper = mountTarget({
            settings: { [COMPLETIONS_KEY]: persisted },
        });
        expect(wrapper.vm.messages).toEqual(persisted);
    });

    test("does not mutate incoming settings object", async () => {
        const wrapper = mountTarget();
        const originalSettings = {};
        await wrapper.setProps({ settings: originalSettings });
        wrapper.vm.userInput = "Hello";
        completionsPost.mockResolvedValueOnce("Reply");
        await wrapper.vm.onMessage();
        expect(originalSettings).toEqual({});
    });

    test("thinking flag toggles during request lifecycle", async () => {
        const wrapper = mountTarget();
        let resolve;
        completionsPost.mockImplementation(
            () =>
                new Promise((r) => {
                    resolve = r;
                }),
        );
        wrapper.vm.userInput = "Hello";
        const promise = wrapper.vm.onMessage();
        expect(wrapper.vm.isThinking).toBe(true);
        resolve("Reply");
        await promise;
        expect(wrapper.vm.isThinking).toBe(false);
    });
});
