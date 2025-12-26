<script setup lang="ts">
import { computed, ref } from "vue";
import {
    AdjustmentsHorizontalIcon,
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

// Determine if tabs should be hidden based on input arrays
const hideTabs = computed(() => props.settingInputs.length === 0 || props.trackInputs.length === 0);

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
                message.value = "Something went wrong.";
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
    <div class="overflow-auto select-none bg-white z-10 p-2">
        <div v-if="datasetId" class="flex">
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
        <div class="bg-blue-50 text-blue-900 rounded my-2 p-2">
            <div class="flex">
                <div class="flex justify-center center-items">
                    <div class="m-2">
                        <img v-if="props.logoUrl" :src="props.logoUrl" class="min-w-14 max-w-14 object-contain" />
                        <ChartsLogo v-else />
                    </div>
                </div>
                <div class="overflow-hidden break-words p-1">
                    <span class="font-bold">{{ html }}</span>
                    <div class="text-xs" v-html="description" />
                </div>
            </div>
        </div>
        <div>
            <div class="font-bold">Title</div>
            <div class="text-xs py-1">Specify a visualization title.</div>
            <n-input :value="visualizationTitle" @input="onUpdateVisualizationTitle" />
        </div>
        <n-tabs
            type="line"
            animated
            class="mt-2"
            pane-wrapper-class="!overflow-visible"
            :tab-class="hideTabs ? '!hidden' : ''">
            <n-tab-pane v-if="trackInputs.length > 0" name="tracks">
                <template #tab>
                    <n-icon><Square3Stack3DIcon /></n-icon>
                    <span class="mx-1">Tracks</span>
                </template>
                <InputRepeats
                    :dataset-id="datasetId"
                    :inputs="trackInputs"
                    :values-array="trackValues"
                    @update:values-array="onUpdateTracks" />
            </n-tab-pane>
            <n-tab-pane v-if="settingInputs.length > 0" name="settings">
                <template #tab>
                    <n-icon><AdjustmentsHorizontalIcon /></n-icon>
                    <span class="mx-1">Settings</span>
                </template>
                <InputForm
                    :dataset-id="datasetId"
                    :inputs="settingInputs"
                    :values="settingValues"
                    @update:values="onUpdateSettings" />
            </n-tab-pane>
        </n-tabs>
    </div>
</template>
