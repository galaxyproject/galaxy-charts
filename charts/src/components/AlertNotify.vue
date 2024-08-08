<script setup>
import { watch } from "vue";
import { NAlert } from "naive-ui";

const MESSAGE_TIMEOUT = 2000;

const props = defineProps({
    message: {
        type: String,
        required: true,
    },
    messageType: {
        type: String,
        default: "info",
    },
});

const emit = defineEmits(["timeout"]);

// Watch and clear messages
let timeoutMessage = null;
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
