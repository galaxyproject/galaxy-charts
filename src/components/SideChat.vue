<script setup lang="ts">
import { computed, ref, nextTick, watch } from "vue";
import { NInput } from "naive-ui";
import type { TranscriptRoleType, TranscriptMessageType, TranscriptVariantType } from "@/types";
import { PaperAirplaneIcon, NoSymbolIcon, TrashIcon } from "@heroicons/vue/24/outline";
import SideButton from "./SideButton.vue";
import SideConfirm from "@/components/SideConfirm.vue";
import SideMessage from "@/components/SideMessage.vue";

const PLACEHOLDER = "Talk to me...";

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
const isConfirm = computed(() => lastTranscript.value && lastTranscript.value.variant == "confirm");
const isStop = computed(() => lastTranscript.value && lastTranscript.value.variant == "stop");
const isThinking = computed(() => lastTranscript.value && lastTranscript.value.role == "user");

function addTranscript({
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

function onAccept() {
    if (isConfirm.value) {
        addTranscript({ content: "", role: "user", variant: "accept" });
    }
}

function onInput() {
    const text = userInput.value.trim();
    if (text && !isThinking.value && !isConfirm.value) {
        addTranscript({ content: text, role: "user" });
        userInput.value = "";
    }
}

function onReject() {
    if (isConfirm.value) {
        addTranscript({ content: "", role: "user", variant: "reject" });
    }
}

function onReset() {
    emit("update:transcripts", []);
}

function onStop() {
    if (!isStop.value) {
        addTranscript({ content: "", role: "user", variant: "stop" });
    }
}

function scrollToBottom() {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
}

watch(
    () => props.transcripts,
    () => nextTick(scrollToBottom),
);
</script>

<template>
    <div class="flex flex-col h-full">
        <div ref="container" class="flex-1 overflow-y-auto space-y-2">
            <div
                v-for="(msg, msgIndex) in props.transcripts"
                :key="msgIndex"
                :class="msg.role === 'user' ? 'justify-end' : 'justify-start'">
                <SideMessage v-if="!msg.variant" :content="msg.content" :role="msg.role" />
                <SideConfirm
                    v-else-if="msg.role == 'assistant' && msg.variant == 'confirm'"
                    :content="msg.content"
                    @accept="onAccept"
                    @reject="onReject" />
            </div>
            <SideMessage v-if="isThinking" role="assistant" :is-thinking="true" />
        </div>
        <div class="pt-4 pb-2 flex items-center gap-2">
            <div class="flex-1">
                <n-input
                    v-model:value="userInput"
                    type="text"
                    :placeholder="PLACEHOLDER"
                    @keydown.enter.prevent="onInput" />
            </div>
            <SideButton v-if="isThinking" :icon="NoSymbolIcon" title="Stop" type="warning" @click="onStop" />
            <SideButton
                v-else
                :disabled="isConfirm || isThinking || !userInput"
                :icon="PaperAirplaneIcon"
                title="Submit"
                type="primary"
                @click="onInput" />
            <SideButton
                :disabled="isThinking || !hasTranscripts"
                :icon="TrashIcon"
                title="Clear"
                type="error"
                @click="onReset" />
        </div>
    </div>
</template>
