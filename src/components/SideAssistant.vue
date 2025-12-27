<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import { NButton, NIcon, NInput } from "naive-ui";
import type { InputValuesType } from "@/types";
import { useConfigStore } from "@/store/configStore";
import { PaperAirplaneIcon } from "@heroicons/vue/24/outline";
import { completionsPost, type CompletionsMessage } from "@/api/completions";
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
    (event: "click"): void;
}>();

const DEFAULT_PROMPT = "You are data analysis and data visualization expert.";
const INITIAL_MESSAGE = "Hi, I am here to help!";

const container = ref<HTMLElement | null>(null);
const input = ref("");
const messages = ref<CompletionsMessage[]>([]);
const thinking = ref<boolean>(false);

let nextId = 0;

async function onInit() {
    messages.value.push({
        id: nextId++,
        role: "system",
        content: DEFAULT_PROMPT,
    });
    messages.value.push({
        id: nextId++,
        role: "assistant",
        content: INITIAL_MESSAGE,
    });
    nextTick(scrollToBottom);
}

async function onMessage() {
    const text = input.value.trim();
    if (text) {
        messages.value.push({
            id: nextId++,
            role: "user",
            content: text,
        });
        input.value = "";
        await requestCompletions();
    }
}

async function requestCompletions() {
    thinking.value = true;
    nextTick(scrollToBottom);
    try {
        const aiBaseUrl = props.specs.ai_api_base_url || `${root}/ai/plugins/${props.pluginName}`;
        const reply = await completionsPost({
            aiBaseUrl,
            aiApiKey: props.specs.ai_api_key || "",
            aiModel: props.specs.ai_model || "",
            messages: messages.value,
        });
        const assistantId = nextId++;
        messages.value.push({
            id: assistantId,
            role: "assistant",
            content: reply || "No response.",
        });
    } catch (e) {
        console.log(e);
        /*const msg = messages.value.find((m) => m.id === assistantId);
        if (msg) {
            msg.content = "Error contacting AI service.";
        }*/
    }
    thinking.value = false;
    nextTick(scrollToBottom);
}

function scrollToBottom() {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
}

onMounted(() => {
    onInit();
});
</script>

<template>
    <div class="flex flex-col h-full">
        <div ref="container" class="flex-1 overflow-y-auto space-y-2">
            <div v-for="msg in messages" :key="msg.id" :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
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
            <n-button data-description="side assistent submit" :disabled="!input" type="primary" @click="onMessage">
                <n-icon><PaperAirplaneIcon /></n-icon>
            </n-button>
        </div>
    </div>
</template>
