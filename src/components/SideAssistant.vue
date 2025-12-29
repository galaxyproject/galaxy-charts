<script setup lang="ts">
import { computed, ref, nextTick, watch } from "vue";
import { NButton, NIcon, NInput } from "naive-ui";
import type { TranscriptRoleType, TranscriptMessageType, TranscriptVariantType } from "@/types";
import { PaperAirplaneIcon, TrashIcon } from "@heroicons/vue/24/outline";
import AlertNotify from "@/components/AlertNotify.vue";
import SideMessage from "@/components/SideMessage.vue";

const props = defineProps<{
    transcripts: TranscriptMessageType[];
}>();

const emit = defineEmits<{
    (event: "update:transcripts", transcripts: TranscriptMessageType[]): void;
}>();

const container = ref<HTMLElement | null>(null);
const errorMessage = ref<string>("");
const transcripts = ref<TranscriptMessageType[]>([]);
const userInput = ref("");

const hasTranscripts = computed(() => transcripts.value.length > 1);
const isThinking = computed(
    () => transcripts.value.length > 0 && transcripts.value[transcripts.value.length - 1].role == "user",
);

function addMessage({
    content,
    role,
    variant,
}: {
    content: any;
    role: TranscriptRoleType;
    variant?: TranscriptVariantType;
}) {
    const next = [...transcripts.value, { content, role, variant }];
    emit("update:transcripts", next);
}

async function onMessage() {
    const text = userInput.value.trim();
    if (text) {
        addMessage({ content: text, role: "user" });
        userInput.value = "";
        nextTick(scrollToBottom);
    }
}

function onReset() {
    emit("update:transcripts", []);
}

function scrollToBottom() {
    if (container.value) {
        container.value.scrollTop = container.value.scrollHeight;
    }
}

watch(
    () => props.transcripts,
    () => (transcripts.value = [...props.transcripts]),
    { immediate: true },
);
</script>

<template>
    <div class="flex flex-col h-full">
        <AlertNotify :message="errorMessage" message-type="error" @timeout="errorMessage = ''" />
        <div ref="container" class="flex-1 overflow-y-auto space-y-2">
            <div
                v-for="(msg, msgIndex) in transcripts"
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
                :disabled="isThinking || !hasTranscripts"
                type="error"
                @click="onReset">
                <n-icon><TrashIcon /></n-icon>
            </n-button>
        </div>
    </div>
</template>
