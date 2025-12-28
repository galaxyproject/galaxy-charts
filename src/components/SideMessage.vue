<script setup lang="ts">
import DOMPurify from "dompurify";
import MarkdownIt from "markdown-it";
import { NIcon } from "naive-ui";
import { computed } from "vue";
import { ArrowPathIcon, FaceFrownIcon } from "@heroicons/vue/24/outline";
import { type CompletionsRole } from "@/api/completions";

const props = defineProps<{
    content?: string;
    role: CompletionsRole;
    isThinking?: boolean;
}>();

const ASSISTANT_COLOR = "green";
const USER_COLOR = "blue";

const color = computed(() => (props.role === "user" ? USER_COLOR : ASSISTANT_COLOR));

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
            :class="`border-${color}-200 bg-${color}-50 text-${color}-900`">
            <span v-if="isThinking">
                <n-icon>
                    <ArrowPathIcon class="animate-spin size-4 inline" />
                </n-icon>
                <span class="ml-1">Thinking...</span>
            </span>
            <span v-else-if="content" v-html="renderMarkdown(content)" />
            <span v-else>
                <n-icon>
                    <FaceFrownIcon class="size-4 inline" />
                </n-icon>
                <span class="ml-1">No reply.</span>
            </span>
        </div>
    </div>
</template>
