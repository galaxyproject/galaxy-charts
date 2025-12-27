<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import type { Component } from "vue";
import { NButton, NIcon, NInput, NTooltip } from "naive-ui";
import type { InputValuesType } from "@/types";
import { useConfigStore } from "@/store/configStore";
import { ArrowPathIcon, PaperAirplaneIcon } from "@heroicons/vue/24/outline";

type Role = "user" | "assistant" | "system";

interface Message {
    id: number;
    role: Role;
    content: string;
}

const configStore = useConfigStore();
const root = configStore.getRoot();

const props = defineProps<{
    datasetId: string;
    settings: InputValuesType;
    specs: {
        ai_api_base_url?: string;
        ai_api_key?: string;
        ai_max_tokens?: string;
        ai_model?: string;
        ai_temperature?: string;
        ai_top_p?: string;
    };
    tracks: InputValuesType[];
}>();

const emit = defineEmits<{
    (event: "click"): void;
}>();

const TEST_DATA = "test-data/1.tabular";

const viewport = ref<HTMLElement | null>(null);
const input = ref("");
const messages = ref<Message[]>([]);

let nextId = 0;

for (let i = 0; i < 20; i++)
    messages.value.push({
        id: nextId++,
        role: i % 2 ? "user" : "assistant",
        content: "Hi, I am here to help!",
    });

async function onInit() {
    const isTestData = props.datasetId === "__test__";
    const url = isTestData ? TEST_DATA : `${root}api/datasets/${props.datasetId}/display`;

    const response = await fetch(url);
    const content = await response.text();

    messages.value.push({
        id: nextId++,
        role: "system",
        content: `You are a dataset analysis assistant.

The following dataset is provided for analysis.

# DATASTART
${content}
# DATAEND


Respond with a structured Vega JSON.
`,
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
        await requestAssistantReply();
    }
}

async function requestAssistantReply() {
    const assistantId = nextId++;
    messages.value.push({
        id: assistantId,
        role: "assistant",
        content: "Thinking…",
    });
    nextTick(scrollToBottom);
    try {
        const payloadMessages = messages.value
            .filter((m) => m.id !== assistantId)
            .map(({ role, content }) => ({ role, content }));
        const response = await fetch(`${props.specs.ai_api_base_url}chat/completions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${props.specs.ai_api_key}`,
            },
            body: JSON.stringify({
                max_tokens: parseInt(props.specs.ai_max_tokens || "1000"),
                messages: payloadMessages,
                model: props.specs.ai_model,
                temperature: parseFloat(props.specs.ai_temperature || "0.3"),
                top_p: parseFloat(props.specs.ai_top_p || "0.8"),
            }),
        });
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content;
        const msg = messages.value.find((m) => m.id === assistantId);
        if (msg) {
            msg.content = reply || "No response.";
        }
    } catch (e) {
        const msg = messages.value.find((m) => m.id === assistantId);
        if (msg) {
            msg.content = "Error contacting AI service.";
        }
    }
    nextTick(scrollToBottom);
}

function scrollToBottom() {
    if (viewport.value) {
        viewport.value.scrollTop = viewport.value.scrollHeight;
    }
}

onMounted(() => {
    onInit();
});
</script>

<template>
    <div class="flex flex-col h-full">
        <!-- Messages -->
        <div ref="viewport" class="flex-1 overflow-y-auto space-y-2">
            <div
                v-for="msg in messages"
                :key="msg.id"
                class="flex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                <div
                    v-if="msg.role != 'system'"
                    class="max-w-[90%] px-4 py-2 rounded-lg border border-solid whitespace-normal break-words"
                    :class="{
                        'border-green-200 bg-green-50 text-green-900': msg.role === 'assistant',
                        'border-blue-200 bg-blue-50 text-blue-900': msg.role === 'user',
                    }">
                    <span v-if="msg.content == 'Thinking…'">
                        <n-icon>
                            <ArrowPathIcon class="animate-spin size-4 inline mr-1" />
                        </n-icon>
                        Thinking...
                    </span>
                    <div v-else>
                        {{ msg.content }}
                    </div>
                </div>
            </div>
        </div>

        <!-- Input -->
        <div class="pt-2 pb-2 flex items-center gap-2">
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
