<script setup>
import { ref } from "vue";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { NIcon, NTooltip } from "naive-ui";
import { versionGet } from "@/api/version";

const props = defineProps({
    root: {
        type: String,
        required: true,
    },
});

const version = ref("...");

async function checkVersion() {
    try {
        version.value = await versionGet(props.root);
    } catch (err) {
        console.error(err);
        version.value = "";
    }
}

checkVersion();
</script>

<template>
    <n-tooltip v-if="version" class="mx-1" trigger="hover">
        <template #trigger>
            <n-icon class="mx-1">
                <CheckCircleIcon class="text-green-600" />
            </n-icon>
        </template>
        <span class="text-xs">Connected to Galaxy Version {{ version }}</span>
    </n-tooltip>
    <n-tooltip v-else class="mx-1" trigger="hover">
        <template #trigger>
            <n-icon class="mx-1">
                <ExclamationCircleIcon class="text-red-600" />
            </n-icon>
        </template>
        <span class="text-xs">Galaxy not available</span>
    </n-tooltip>
</template>
