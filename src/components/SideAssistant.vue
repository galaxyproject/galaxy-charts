<script setup lang="ts">
import { onMounted, ref, nextTick, computed } from "vue";
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
        ai_model?: string;
        ai_prompt?: string;
        ai_temperature?: string;
        ai_top_p?: string;
        ai_contract?: any;
    };
    tracks: InputValuesType[];
}>();

const emit = defineEmits<{
    (event: "update:messages", messages: CompletionsMessage[]): void;
}>();

const DEFAULT_PROMPT = "You are data analysis and data visualization expert.";
const INITIAL_MESSAGE = "Hi, I am here to help!";
const STATE_MESSAGE = "I am sharing my latest settings and tracks as state.";

const currentState = ref<string>("");
const container = ref<HTMLElement | null>(null);
const errorMessage = ref<string>("");
const messages = ref<CompletionsMessage[]>([]);
const isThinking = ref<boolean>(false);
const userInput = ref("");

const aiBaseUrl = computed(() => props.specs.ai_api_base_url || `${root}/ai/plugins/${props.pluginName}`);
const hasMessages = computed(() => messages.value.length > 2);

function addMessage(content: string, role: CompletionsRole, hidden: boolean = false) {
    messages.value.push({ role, content, hidden });
    emit("update:messages", messages.value);
}

function addState() {
    const { [COMPLETIONS_KEY]: _, ...settings } = props.settings;
    const newState = JSON.stringify({ settings, tracks: props.tracks });
    if (newState !== currentState.value) {
        addMessage(`${STATE_MESSAGE} ${newState}`, "user", true);
        currentState.value = newState;
    }
}

function initialize() {
    if (messages.value.length === 0) {
        addMessage(props.specs?.ai_prompt || DEFAULT_PROMPT, "system");
        addMessage(INITIAL_MESSAGE, "assistant");
    }
    nextTick(scrollToBottom);
}

async function onMessage() {
    const text = userInput.value.trim();
    if (text) {
        addState();
        addMessage(text, "user");
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
            addMessage(reply.json, "assistant");
            addMessage(reply.content, "assistant");
        } catch (e) {
            errorMessage.value = String(e);
            console.error(e);
        }
        isThinking.value = false;
        nextTick(scrollToBottom);
    }
}

function onReset() {
    messages.value = [];
    initialize();
}

function scrollToBottom() {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
}

onMounted(() => {
    messages.value = props.settings[COMPLETIONS_KEY] || [];
    initialize();
});
</script>

<template>
    <div class="flex flex-col h-full">
        <AlertNotify :message="errorMessage" message-type="error" @timeout="errorMessage = ''" />
        <div ref="container" class="flex-1 overflow-y-auto space-y-2">
            <div
                v-for="(msg, msgIndex) in messages"
                :key="msgIndex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                <SideMessage v-if="!msg.hidden" :content="msg.content" :role="msg.role" />
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
