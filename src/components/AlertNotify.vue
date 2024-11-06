<script setup lang="ts">
import { watch } from "vue";
import { NAlert } from "naive-ui";
import { MessageType } from "@/types";

const MESSAGE_TIMEOUT = 2000;

const props = withDefaults(
    defineProps<{
        message: string;
        messageType?: MessageType;
    }>(),
    {
        messageType: "info",
    },
);

const emit = defineEmits(["timeout"]);

// Watch and clear messages
let timeoutMessage: ReturnType<typeof setTimeout> | null = null;
watch(
    () => props.message,
    () => {
        timeoutMessage && clearTimeout(timeoutMessage);
        timeoutMessage = setTimeout(() => emit("timeout"), MESSAGE_TIMEOUT);
    },
);
</script>

<template>
    <n-alert v-if="message" :type="messageType" class="m-4">
        {{ message }}
    </n-alert>
</template>
