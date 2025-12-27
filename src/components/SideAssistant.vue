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
    };
    tracks: InputValuesType[];
}>();

const emit = defineEmits<{
    (event: "update:messages", messages: CompletionsMessage[]): void;
}>();

const DEFAULT_PROMPT = "You are data analysis and data visualization expert.";
const INITIAL_MESSAGE = "Hi, I am here to help!";

const container = ref<HTMLElement | null>(null);
const errorMessage = ref<string>("");
const input = ref("");
const messages = ref<CompletionsMessage[]>([]);
const thinking = ref<boolean>(false);

const aiBaseUrl = computed(() => props.specs.ai_api_base_url || `${root}/ai/plugins/${props.pluginName}`);
const hasMessages = computed(() => messages.value.length > 2);

function addMessage(content: string, role: CompletionsRole) {
    messages.value.push({ role, content });
    emit("update:messages", messages.value);
}

async function initialize() {
    if (messages.value.length === 0) {
        addMessage(props.specs?.ai_prompt || DEFAULT_PROMPT, "system");
        addMessage(INITIAL_MESSAGE, "assistant");
    }
    nextTick(scrollToBottom);
}

async function onMessage() {
    const text = input.value.trim();
    if (text) {
        addMessage(text, "user");
        input.value = "";
        thinking.value = true;
        nextTick(scrollToBottom);
        try {
            const reply = await completionsPost({
                aiBaseUrl: aiBaseUrl.value,
                aiApiKey: props.specs.ai_api_key || "unknown",
                aiModel: props.specs.ai_model || "unknown",
                messages: messages.value,
            });
            addMessage(reply, "assistant");
        } catch (e) {
            errorMessage.value = String(e);
            console.error(e);
        }
        thinking.value = false;
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
                <SideMessage :content="msg.content" :role="msg.role" />
            </div>
            <SideMessage v-if="thinking" role="assistant" :thinking="true" />
        </div>
        <div class="pt-4 pb-2 flex items-center gap-2">
            <div class="flex-1">
                <n-input
                    v-model:value="input"
                    type="text"
                    placeholder="Talk to me..."
                    @keydown.enter.prevent="onMessage" />
            </div>
            <n-button
                data-description="side assistent submit"
                :disabled="thinking || !input"
                type="primary"
                @click="onMessage">
                <n-icon><PaperAirplaneIcon /></n-icon>
            </n-button>
            <n-button
                data-description="side assistent reset"
                :disabled="thinking || !hasMessages"
                type="error"
                @click="onReset">
                <n-icon><TrashIcon /></n-icon>
            </n-button>
        </div>
    </div>
</template>
