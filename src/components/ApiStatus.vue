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
    } catch (_err) {
        console.debug(`[charts] Unable to connect to Galaxy. Verify Galaxy is running and refer to docs.`);
        version.value = "";
    }
}

checkVersion();
</script>

<template>
    <n-tooltip trigger="hover" :to="false">
        <template #trigger>
            <span class="mx-1">
                <n-icon>
                    <CheckCircleIcon v-if="version" class="text-green-600" />
                    <ExclamationCircleIcon v-else class="text-red-600" />
                </n-icon>
            </span>
        </template>
        <span class="text-xs">
            {{ version ? `Connected to Galaxy Version ${version}.` : "Galaxy is not accessible!" }}
        </span>
    </n-tooltip>
</template>
