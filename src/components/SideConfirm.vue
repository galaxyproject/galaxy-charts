<script setup lang="ts">
import { CheckIcon, XMarkIcon } from "@heroicons/vue/24/outline";
import SideButton from "@/components/SideButton.vue";
import { TranscriptContentType } from "@/types";

defineProps<{
    content?: TranscriptContentType;
}>();

const emit = defineEmits<{
    (event: "accept"): void;
    (event: "reject"): void;
}>();
</script>

<template>
    <div class="chat-message chat-message-assistant">
        <div class="mb-2 font-bold">{{ content }}</div>
        <div class="flex justify-start">
            <SideButton button-class="mr-2" :icon="CheckIcon" title="Accept" type="primary" @click="emit('accept')" />
            <SideButton :icon="XMarkIcon" title="Reject" type="error" @click="emit('reject')" />
        </div>
    </div>
</template>
