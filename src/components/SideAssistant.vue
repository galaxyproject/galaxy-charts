<script setup lang="ts">
import { onMounted, ref, nextTick } from "vue";
import type { Component } from "vue";
import { NButton, NIcon, NTooltip } from "naive-ui";
import type { InputValuesType } from "@/types";
import { useConfigStore } from "@/store/configStore";

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
    <div class="flex flex-col h-full bg-gray-900 text-white">
        <!-- Messages -->
        <div ref="viewport" class="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            <div
                v-for="msg in messages"
                :key="msg.id"
                class="flex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                <div
                    class="max-w-[75%] px-4 py-2 rounded-lg whitespace-pre-wrap"
                    :class="{
                        'bg-blue-600 text-white': msg.role === 'user',
                        'bg-gray-800 text-gray-100': msg.role === 'assistant',
                        'bg-gray-700 text-gray-300 text-sm italic': msg.role === 'system',
                    }">
                    {{ msg.content }}
                </div>
            </div>
        </div>

        <!-- Input -->
        <div class="border-t border-gray-700 px-4 py-3">
            <form class="flex items-center gap-2" @submit.prevent="onMessage">
                <input
                    v-model="input"
                    type="text"
                    placeholder="Ask a question about the dataset…"
                    class="flex-1 bg-gray-800 text-white placeholder-gray-500 rounded-md px-3 py-2 focus:outline-none focus:ring focus:ring-blue-600" />
                <button
                    type="submit"
                    class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md disabled:opacity-50">
                    Send
                </button>
            </form>
        </div>
    </div>
</template>
