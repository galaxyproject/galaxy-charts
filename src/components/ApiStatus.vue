<script setup lang="ts">
import { ref } from "vue";
import { CheckCircleIcon, ExclamationCircleIcon } from "@heroicons/vue/24/outline";
import { NIcon, NTooltip } from "naive-ui";
import { GalaxyApi } from "@/api/client";

const version = ref("...");

async function checkVersion() {
    try {
        const { data } = await GalaxyApi().GET("/api/version");
        version.value = data.version_major;
    } catch (err) {
        console.debug(`[charts] Unable to connect to Galaxy. Verify Galaxy is running and refer to docs.`);
        version.value = "";
    }
}

checkVersion();
</script>

<template>
    <n-tooltip v-if="version" class="mx-1" trigger="hover" :to="false">
        <template #trigger>
            <n-icon class="mx-1">
                <CheckCircleIcon class="text-green-600" />
            </n-icon>
        </template>
        <span class="text-xs">Connected to Galaxy Version {{ version }}.</span>
    </n-tooltip>
    <n-tooltip v-else class="mx-1" trigger="hover" :to="false">
        <template #trigger>
            <n-icon class="mx-1">
                <ExclamationCircleIcon class="text-red-600" />
            </n-icon>
        </template>
        <span class="text-xs">Galaxy is not accessible!</span>
    </n-tooltip>
</template>
