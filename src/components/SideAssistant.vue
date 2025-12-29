<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from "vue";
import { NButton, NIcon, NInput } from "naive-ui";
import type { InputValuesType } from "@/types";
import { useConfigStore } from "@/store/configStore";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/vue/24/outline";
import {
    COMPLETIONS_KEY,
    completionsPost,
    type CompletionsMessage,
    type CompletionsMessageVariant,
    type CompletionsRole,
} from "@/api/completions";
import AlertNotify from "@/components/AlertNotify.vue";
import SideMessage from "@/components/SideMessage.vue";
import { toBoolean } from "@/utilities/toBoolean";

const configStore = useConfigStore();
const root = configStore.getRoot();

const props = defineProps<{
    datasetId: string;
    pluginName: string;
    settings: InputValuesType;
    specs: {
        ai_api_base_url?: string;
        ai_api_key?: string;
        ai_max_tokens?: string;
        ai_message_initial?: string;
        ai_model?: string;
        ai_prompt?: string;
        ai_schema?: string;
        ai_share_state?: string;
        ai_temperature?: string;
        ai_top_p?: string;
        ai_contract?: any;
    };
    tracks: InputValuesType[];
}>();

const emit = defineEmits<{
    (event: "update:messages", messages: CompletionsMessage[]): void;
}>();

const MESSAGE_INITIAL = "Assistant ready.";
const MESSAGE_STRUCTURED = "Structured data available.";
const PROMPT_DEFAULT = "Respond to user messages.";
const PROMPT_SCHEMA = "Output schema follows.";
const PROMPT_STATE = "Context state follows.";

const currentState = ref<string>("");
const container = ref<HTMLElement | null>(null);
const errorMessage = ref<string>("");
const messages = ref<CompletionsMessage[]>([]);
const isThinking = ref<boolean>(false);
const userInput = ref("");

const aiBaseUrl = computed(() => props.specs.ai_api_base_url || `${root}api/ai/plugins/${props.pluginName}`);
const hasMessages = computed(() => messages.value.length > 2);
const initialMessage = computed(() => props.specs?.ai_message_initial || MESSAGE_INITIAL);

function addMessage({
    content,
    role,
    variant,
}: {
    content: any;
    role: CompletionsRole;
    variant?: CompletionsMessageVariant;
}) {
    messages.value.push({ content, role, variant });
    emit("update:messages", messages.value);
}

function addState() {
    if (toBoolean(props.specs.ai_share_state)) {
        const { [COMPLETIONS_KEY]: _, ...settings } = props.settings;
        const newState = JSON.stringify({ settings, tracks: props.tracks });
        if (newState !== currentState.value) {
            addMessage({
                content: `${PROMPT_STATE} ${newState}`,
                role: "user",
                variant: "hidden",
            });
            currentState.value = newState;
        }
    }
}

function initializePrompt(incomingMessages: CompletionsMessage[] = []) {
    messages.value = incomingMessages;
    if (messages.value.length === 0) {
        let systemPrompt = props.specs?.ai_prompt || PROMPT_DEFAULT;
        if (props.specs?.ai_schema) {
            systemPrompt += `\n\n${PROMPT_SCHEMA}\n${props.specs.ai_schema}`;
        }
        addMessage({ content: systemPrompt, role: "system" });
    }
    nextTick(scrollToBottom);
}

async function onMessage() {
    const text = userInput.value.trim();
    if (text) {
        addState();
        addMessage({ content: text, role: "user" });
        userInput.value = "";
        isThinking.value = true;
        nextTick(scrollToBottom);
        try {
            const reply = await completionsPost({
                aiBaseUrl: aiBaseUrl.value,
                aiApiKey: props.specs.ai_api_key || "unknown",
                aiModel: props.specs.ai_model || "unknown",
                messages: messages.value,
            });
            if (reply?.json) {
                addMessage({ content: reply?.content || MESSAGE_STRUCTURED, role: "assistant" });
                addMessage({ content: reply?.json, role: "assistant", variant: "json" });
            } else {
                addMessage({ content: reply?.content || "", role: "assistant" });
            }
        } catch (e) {
            errorMessage.value = String(e);
            console.error(e);
        }
        isThinking.value = false;
        nextTick(scrollToBottom);
    }
}

function onReset() {
    initializePrompt();
}

function scrollToBottom() {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
}

onMounted(() => {
    initializePrompt(props.settings[COMPLETIONS_KEY]);
});
</script>

<template>
    <div class="flex flex-col h-full">
        <AlertNotify :message="errorMessage" message-type="error" @timeout="errorMessage = ''" />
        <div ref="container" class="flex-1 overflow-y-auto space-y-2">
            <SideMessage :content="initialMessage" role="assistant" />
            <div
                v-for="(msg, msgIndex) in messages"
                :key="msgIndex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                <SideMessage v-if="!msg.variant" :content="msg.content" :role="msg.role" />
            </div>
            <SideMessage v-if="isThinking" role="assistant" :is-thinking="true" />
        </div>
        <div class="pt-4 pb-2 flex items-center gap-2">
            <div class="flex-1">
                <n-input
                    v-model:value="userInput"
                    type="text"
                    placeholder="Talk to me..."
                    @keydown.enter.prevent="onMessage" />
            </div>
            <n-button
                data-description="side assistent submit"
                :disabled="isThinking || !userInput"
                type="primary"
                @click="onMessage">
                <n-icon><PaperAirplaneIcon /></n-icon>
            </n-button>
            <n-button
                data-description="side assistent reset"
                :disabled="isThinking || !hasMessages"
                type="error"
                @click="onReset">
                <n-icon><TrashIcon /></n-icon>
            </n-button>
        </div>
    </div>
</template>
