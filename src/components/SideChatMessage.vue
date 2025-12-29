<script setup lang="ts">
import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import { NIcon } from "naive-ui";
import { computed } from "vue";
import { ArrowPathIcon } from "@heroicons/vue/24/outline";
import { type TranscriptRoleType } from "@/types";

const props = defineProps<{
    content?: string;
    isThinking?: boolean;
    role: TranscriptRoleType;
}>();

const colorClasses = computed(() => {
    if (props.role === "user") {
        return "border-blue-200 bg-blue-50 text-blue-900";
    } else {
        return "border-green-200 bg-green-50 text-green-900";
    }
});

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
        <div
            v-if="role != 'system'"
            class="max-w-[90%] px-4 py-2 rounded-lg border border-solid whitespace-normal break-words"
            :class="colorClasses">
            <div v-if="isThinking">
                <n-icon>
                    <ArrowPathIcon class="animate-spin size-4 inline" />
                </n-icon>
                <span class="ml-1">Thinking...</span>
            </div>
            <div v-else-if="content" v-html="renderMarkdown(content)" />
            <div v-else class="ml-1">No content returned.</div>
        </div>
    </div>
</template>
