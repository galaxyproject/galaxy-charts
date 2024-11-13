<script setup lang="ts">
import { computed, ref, defineProps, defineEmits } from "vue";
import {
    AdjustmentsHorizontalIcon,
    ChevronDoubleRightIcon,
    CloudArrowUpIcon,
    Square3Stack3DIcon,
} from "@heroicons/vue/24/outline";
import { NButton, NIcon, NInput, NTabs, NTabPane } from "naive-ui";
import { visualizationsCreate, visualizationsSave } from "@/api/visualizations";
import { errorMessageAsString } from "@/utilities/simpleError";
import InputForm from "@/components/InputForm.vue";
import InputRepeats from "@/components/InputRepeats.vue";
import AlertNotify from "@/components/AlertNotify.vue";
import ApiStatus from "@/components/ApiStatus.vue";
import type { InputElementType, InputValuesType, MessageType } from "@/types";

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
            await visualizationsSave(props.visualizationId, props.visualizationTitle, {
                dataset_id: props.datasetId,
                settings: props.settingValues,
            });
            message.value = "Successfully saved.";
            messageType.value = "success";
        } else {
            const newVisualizationId = await visualizationsCreate(props.name, props.visualizationTitle, {
                dataset_id: props.datasetId,
                settings: props.settingValues,
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
    <div class="overflow-auto select-none bg-white z-10">
        <div class="flex p-2">
            <div class="flex-1 font-thin text-lg p-1 p-2">
                <span>Charts</span>
                <ApiStatus />
            </div>
            <div>
                <n-button strong secondary circle class="bg-sky-100 m-1" @click="onSave">
                    <template #icon>
                        <n-icon><CloudArrowUpIcon /></n-icon>
                    </template>
                </n-button>
                <n-button strong secondary circle class="bg-sky-100 m-1" @click="emit('toggle')">
                    <template #icon>
                        <n-icon><ChevronDoubleRightIcon /></n-icon>
                    </template>
                </n-button>
            </div>
        </div>
        <AlertNotify :message="message" :message-type="messageType" @timeout="message = ''" class="m-4" />
        <div class="m-4 mt-0 p-2 bg-sky-50 text-sky-900 rounded">
            <div class="md:flex">
                <div class="flex justify-center center-items">
                    <div class="m-2">
                        <img v-if="props.logoUrl" :src="props.logoUrl" class="min-w-14 max-w-14 object-contain" />
                        <svg
                            v-else
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 100 100"
                            class="size-14">
                            <circle cx="50" cy="50" r="45" stroke="#E30A17" stroke-width="5" />
                            <path d="M 50,5 A 45,45 0 0,1 95,50 L 50,50 Z" fill="#E30A17" />
                        </svg>
                    </div>
                </div>
                <div class="overflow-hidden break-words p-1">
                    <span class="font-bold">{{ html }}</span>
                    <div class="text-xs" v-html="description" />
                </div>
            </div>
        </div>
        <div class="px-4 pb-2">
            <div class="font-bold">Title</div>
            <div class="text-xs py-1">Specify a visualization title.</div>
            <n-input :value="visualizationTitle" @input="onUpdateVisualizationTitle" />
        </div>
        <n-tabs type="line" animated class="px-4" :tab-class="hideTabs ? '!hidden' : ''">
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
