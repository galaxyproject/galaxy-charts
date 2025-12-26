<script setup lang="ts">
import { computed, ref } from "vue";
import {
    AdjustmentsHorizontalIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    ChevronDoubleRightIcon,
    CloudArrowUpIcon,
    Square3Stack3DIcon,
} from "@heroicons/vue/24/outline";
import { NIcon, NInput, NTabs, NTabPane } from "naive-ui";
import { visualizationsCreate, visualizationsUpdate } from "@/api/visualizations";
import { errorMessageAsString } from "@/utilities/simpleError";
import InputForm from "@/components/inputs/InputForm.vue";
import InputRepeats from "@/components/inputs/InputRepeats.vue";
import AlertNotify from "@/components/AlertNotify.vue";
import ApiStatus from "@/components/ApiStatus.vue";
import SideAssistant from "./SideAssistant.vue";
import SideButton from "./SideButton.vue";
import type { InputElementType, InputValuesType, MessageType } from "@/types";
import ChartsLogo from "./ChartsLogo.vue";

const props = defineProps<{
    datasetId: string;
    description: string;
    logoUrl: string;
    html: string;
    name: string;
    settingInputs: InputElementType[];
    settingValues: InputValuesType;
    specValues: InputValuesType;
    trackInputs: InputElementType[];
    trackValues: InputValuesType[];
    visualizationId: string | null;
    visualizationTitle: string;
}>();

// Emit events with TypeScript
const emit = defineEmits<{
    (event: "update:tracks", newValues: InputValuesType[]): void;
    (event: "update:settings", newValues: InputValuesType): void;
    (event: "update:visualization-id", newId: string): void;
    (event: "update:visualization-title", newTitle: string): void;
    (event: "toggle"): void;
}>();

// Manage message and message type for notifications
const message = ref<string>("");
const messageType = ref<MessageType>("info");

// Identify available tabs
const hasAssistant = computed(() => !!props.specValues.ai_prompt);
const hasDataset = computed(() => !!props.datasetId);
const hasSettings = computed(() => props.settingInputs.length > 0);
const hasTracks = computed(() => props.trackInputs.length > 0);

// Determine if the tabs header should be shown
const showTabs = computed(() => {
    const count = [hasAssistant.value, hasSettings.value, hasTracks.value];
    return count.reduce((acc, curr) => acc + (curr ? 1 : 0), 0) >= 2;
});

// Save or create the visualization
async function onSave(): Promise<void> {
    try {
        if (props.visualizationId) {
            await visualizationsUpdate(props.visualizationId, props.visualizationTitle, {
                dataset_id: props.datasetId,
                settings: props.settingValues,
                tracks: props.trackValues,
            });
            message.value = "Successfully saved.";
            messageType.value = "success";
        } else {
            const newVisualizationId = await visualizationsCreate(props.name, props.visualizationTitle, {
                dataset_id: props.datasetId,
                settings: props.settingValues,
                tracks: props.trackValues,
            });
            if (newVisualizationId) {
                message.value = "Successfully created.";
                messageType.value = "success";
                emit("update:visualization-id", newVisualizationId);
            } else {
                message.value = "Verify that you are logged in and Galaxy is accessible.";
                messageType.value = "error";
            }
        }
    } catch (err) {
        message.value = errorMessageAsString(err);
        messageType.value = "error";
    }
}

// Update settings handler
function onUpdateSettings(newValues: InputValuesType): void {
    emit("update:settings", newValues);
}

// Update tracks handler
function onUpdateTracks(newValues: InputValuesType[]): void {
    emit("update:tracks", newValues);
}

// Update title handler
function onUpdateVisualizationTitle(newTitle: string): void {
    emit("update:visualization-title", newTitle);
}
</script>

<template>
    <div class="flex flex-col h-screen overflow-hidden select-none bg-white p-2 z-10">
        <div v-if="hasDataset" class="flex">
            <div class="flex-1 font-thin text-lg mt-1">
                <span>Charts</span>
                <ApiStatus />
            </div>
            <div>
                <SideButton cls="mr-2" :icon="CloudArrowUpIcon" title="Save" @click="onSave" />
                <SideButton :icon="ChevronDoubleRightIcon" title="Collapse" @click="emit('toggle')" />
            </div>
        </div>
        <AlertNotify :message="message" :message-type="messageType" @timeout="message = ''" class="mt-2" />
        <div class="bg-blue-50 text-blue-900 rounded mt-2 p-2">
            <div class="flex">
                <div class="flex justify-center center-items">
                    <div class="m-2">
                        <img v-if="props.logoUrl" :src="props.logoUrl" class="min-w-14 max-w-14 object-contain" />
                        <ChartsLogo v-else />
                    </div>
                </div>
                <div class="overflow-hidden break-words p-1">
                    <span class="font-bold">{{ html }}</span>
                    <div class="text-xs line-clamp-3">{{ description }}</div>
                </div>
            </div>
        </div>
        <n-tabs
            type="line"
            animated
            class="flex-1 min-h-0"
            pane-wrapper-class="!h-full !min-h-0 !overflow-hidden"
            :tab-class="showTabs ? '' : '!hidden'">
            <n-tab-pane v-if="hasTracks" name="tracks" class="h-full">
                <template #tab>
                    <n-icon><Square3Stack3DIcon /></n-icon>
                    <span class="mx-1">Tracks</span>
                </template>
                <div class="h-full overflow-auto">
                    <InputRepeats
                        :dataset-id="datasetId"
                        :inputs="trackInputs"
                        :values-array="trackValues"
                        @update:values-array="onUpdateTracks" />
                </div>
            </n-tab-pane>
            <n-tab-pane v-if="hasSettings" name="settings" class="h-full">
                <template #tab>
                    <n-icon><AdjustmentsHorizontalIcon /></n-icon>
                    <span class="mx-1">Settings</span>
                </template>
                <div class="h-full overflow-auto">
                    <div class="pb-2">
                        <div class="font-bold">Title</div>
                        <div class="text-xs py-1">Specify a visualization title.</div>
                        <n-input :value="visualizationTitle" @input="onUpdateVisualizationTitle" />
                    </div>
                    <InputForm
                        :dataset-id="datasetId"
                        :inputs="settingInputs"
                        :values="settingValues"
                        @update:values="onUpdateSettings" />
                </div>
            </n-tab-pane>
            <n-tab-pane v-if="hasAssistant" name="assistant" class="h-full">
                <template #tab>
                    <n-icon><ChatBubbleOvalLeftEllipsisIcon /></n-icon>
                    <span class="mx-1">Assistant</span>
                </template>
                <SideAssistant
                    :dataset-id="datasetId"
                    :settings="settingValues"
                    :specs="specValues"
                    :tracks="trackValues" />
            </n-tab-pane>
        </n-tabs>
    </div>
</template>
