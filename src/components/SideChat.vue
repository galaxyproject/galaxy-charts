<script setup lang="ts">
import { computed, ref, nextTick, watch } from "vue";
import { NInput } from "naive-ui";
import {
    type TranscriptRoleType,
    type TranscriptMessageType,
    type TranscriptVariantType,
    TRANSCRIPT_ROLE,
    TRANSCRIPT_VARIANT,
} from "@/types";
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
const isConfirm = computed(() => lastTranscript.value && lastTranscript.value.variant == TRANSCRIPT_VARIANT.CONFIRM);
const isStop = computed(() => lastTranscript.value && lastTranscript.value.variant == TRANSCRIPT_VARIANT.STOP);
const isThinking = computed(() => lastTranscript.value && lastTranscript.value.role == TRANSCRIPT_ROLE.USER);

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
        addTranscript({ content: "", role: TRANSCRIPT_ROLE.USER, variant: TRANSCRIPT_VARIANT.ACCEPT });
    }
}

function onInput() {
    const text = userInput.value.trim();
    if (text && !isThinking.value && !isConfirm.value) {
        addTranscript({ content: text, role: TRANSCRIPT_ROLE.USER });
        userInput.value = "";
    }
}

function onReject() {
    if (isConfirm.value) {
        addTranscript({ content: "", role: TRANSCRIPT_ROLE.USER, variant: TRANSCRIPT_VARIANT.REJECT });
    }
}

function onReset() {
    emit("update:transcripts", []);
}

function onStop() {
    if (!isStop.value) {
        addTranscript({ content: "", role: TRANSCRIPT_ROLE.USER, variant: TRANSCRIPT_VARIANT.STOP });
    }
}

function scrollToBottom() {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
}

function showMessage(msg: TranscriptMessageType) {
    return msg.role !== TRANSCRIPT_ROLE.SYSTEM && (!msg.variant || msg.variant === TRANSCRIPT_VARIANT.INFO);
}

watch(
    () => props.transcripts,
    () => nextTick(scrollToBottom),
    { immediate: true },
);
</script>

<template>
    <div class="flex flex-col h-full select-text">
        <div ref="container" class="flex-1 overflow-y-auto space-y-2">
            <div v-for="(msg, msgIndex) in props.transcripts" :key="msgIndex">
                <SideMessage v-if="showMessage(msg)" :content="msg.content" :role="msg.role" />
                <SideConfirm
                    v-else-if="msg.role == TRANSCRIPT_ROLE.ASSISTANT && msg.variant == TRANSCRIPT_VARIANT.CONFIRM"
                    :content="msg.content"
                    @accept="onAccept"
                    @reject="onReject" />
            </div>
            <SideMessage v-if="isThinking" :role="TRANSCRIPT_ROLE.ASSISTANT" :is-thinking="true" />
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
