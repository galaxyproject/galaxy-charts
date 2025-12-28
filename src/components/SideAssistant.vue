<script setup lang="ts">
import { computed, onMounted, ref, nextTick } from "vue";
import { NButton, NIcon, NInput } from "naive-ui";
import type { InputValuesType } from "@/types";
import { useConfigStore } from "@/store/configStore";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/vue/24/outline";
import { COMPLETIONS_KEY, completionsPost, type CompletionsMessage, type CompletionsRole } from "@/api/completions";
import AlertNotify from "@/components/AlertNotify.vue";
import SideMessage from "@/components/SideMessage.vue";

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
const PROMPT_DEFAULT = "Respond to user messages. Context state may be provided.";
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
    hidden,
    json,
    role,
}: {
    content: string;
    hidden?: boolean;
    json?: any;
    role: CompletionsRole;
}) {
    messages.value.push({ role, content, json, hidden });
    emit("update:messages", messages.value);
}

function addState() {
    const { [COMPLETIONS_KEY]: _, ...settings } = props.settings;
    const newState = JSON.stringify({ settings, tracks: props.tracks });
    if (newState !== currentState.value) {
        addMessage({
            content: `${PROMPT_STATE} ${newState}`,
            role: "user",
            hidden: true,
        });
        currentState.value = newState;
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
            addMessage({ content: reply?.content || "", json: reply?.json, role: "assistant" });
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
                <SideMessage v-if="!msg.hidden" :content="msg.content" :json="msg.json" :role="msg.role" />
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
