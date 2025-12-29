<script setup lang="ts">
import { computed, ref, nextTick } from "vue";
import { NButton, NIcon, NInput, NTooltip } from "naive-ui";
import type { TranscriptRoleType, TranscriptMessageType, TranscriptVariantType } from "@/types";
import { PaperAirplaneIcon, NoSymbolIcon, TrashIcon } from "@heroicons/vue/24/outline";
import SideButton from "./SideButton.vue";
import SideChatMessage from "@/components/SideChatMessage.vue";

const props = defineProps<{
    transcripts: TranscriptMessageType[];
}>();

const emit = defineEmits<{
    (event: "update:transcripts", transcripts: TranscriptMessageType[]): void;
}>();

const container = ref<HTMLElement | null>(null);
const userInput = ref("");

const hasTranscripts = computed(() => props.transcripts.length > 0);
const lastTranscript = computed(() => hasTranscripts.value && props.transcripts[props.transcripts.length - 1]);
const isStop = computed(() => lastTranscript.value && lastTranscript.value.variant == "stop");
const isThinking = computed(() => lastTranscript.value && lastTranscript.value.role == "user");

function addMessage({
    content,
    role,
    variant,
}: {
    content: any;
    role: TranscriptRoleType;
    variant?: TranscriptVariantType;
}) {
    const next = [...props.transcripts, { content, role, variant }];
    emit("update:transcripts", next);
}

async function onMessage() {
    const text = userInput.value.trim();
    if (text && !isThinking.value) {
        addMessage({ content: text, role: "user" });
        userInput.value = "";
        nextTick(scrollToBottom);
    }
}

function onReset() {
    emit("update:transcripts", []);
}

function onStop() {
    if (!isStop.value) {
        addMessage({ content: "", role: "user", variant: "stop" });
    }
}

function scrollToBottom() {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
}
</script>

<template>
    <div class="flex flex-col h-full">
        <div ref="container" class="flex-1 overflow-y-auto space-y-2">
            <div
                v-for="(msg, msgIndex) in props.transcripts"
                :key="msgIndex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                <SideChatMessage v-if="!msg.variant" :content="msg.content" :role="msg.role" />
                <div v-else-if="msg.role == 'assistant' && msg.variant == 'confirm'">
                    {{ msg.content }}
                </div>
            </div>
            <SideChatMessage v-if="isThinking" role="assistant" :is-thinking="true" />
        </div>
        <div class="pt-4 pb-2 flex items-center gap-2">
            <div class="flex-1">
                <n-input
                    v-model:value="userInput"
                    type="text"
                    placeholder="Talk to me..."
                    @keydown.enter.prevent="onMessage" />
            </div>
            <SideButton v-if="isThinking" :icon="NoSymbolIcon" title="Stop" type="warning" @click="onStop" />
            <SideButton
                v-else
                :disabled="!userInput"
                :icon="PaperAirplaneIcon"
                title="Submit"
                type="primary"
                @click="onMessage" />
            <SideButton
                :disabled="isThinking || !hasTranscripts"
                :icon="TrashIcon"
                title="Clear"
                type="error"
                @click="onReset" />
        </div>
    </div>
</template>
