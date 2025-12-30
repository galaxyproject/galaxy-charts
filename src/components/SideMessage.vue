<script setup lang="ts">
import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import { NIcon } from "naive-ui";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import type { TranscriptRoleType, TranscriptContentType } from "@/types";

const props = defineProps<{
    content?: TranscriptContentType;
    isThinking?: boolean;
    role: TranscriptRoleType;
}>();

const md = new MarkdownIt({
    linkify: true,
    breaks: true,
});

function renderMarkdown(source: string) {
    const html = md.render(source);
    return DOMPurify.sanitize(html);
}
</script>

<template>
    <div class="flex" :class="role === 'user' ? 'justify-end' : 'justify-start'">
        <div class="chat-message max-w-[90%]" :class="role == 'user' ? 'chat-message-user' : 'chat-message-assistant'">
            <div v-if="isThinking">
                <n-icon>
                    <ArrowPathIcon class="animate-spin size-4 inline" />
                </n-icon>
                <span class="ml-1">Thinking...</span>
            </div>
            <div v-else-if="content && typeof content === 'string'" v-html="renderMarkdown(content)" />
            <div v-else class="ml-1">No content returned.</div>
        </div>
    </div>
</template>
