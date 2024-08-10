<script setup>
import { ref, watch } from "vue";
import {
    AdjustmentsHorizontalIcon,
    ChevronDoubleRightIcon,
    CloudArrowUpIcon,
    PresentationChartLineIcon,
    Square3Stack3DIcon,
} from "@heroicons/vue/24/outline";
import { NButton, NIcon, NInput, NTabs, NTabPane } from "naive-ui";
import { visualizationsCreate, visualizationsSave } from "@/api/visualizations";
import { errorMessageAsString } from "@/utilities/simpleError";
import InputForm from "@/components/InputForm.vue";
import InputRepeats from "./InputRepeats.vue";
import AlertNotify from "@/components/AlertNotify.vue";

const props = defineProps({
    datasetId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "This visualization has no description.",
    },
    logoUrl: {
        type: String,
        default: "",
    },
    html: {
        type: String,
        default: "Visualization Title",
    },
    name: {
        type: String,
        required: true,
    },
    root: {
        type: String,
        required: true,
    },
    settingInputs: {
        type: Array,
        default: () => [],
    },
    settingValues: {
        type: Object,
        default: () => {},
    },
    trackInputs: {
        type: Array,
        default: () => [],
    },
    trackValues: {
        type: Object,
        default: () => [],
    },
    visualizationId: {
        type: String,
        default: null,
    },
    visualizationTitle: {
        type: String,
        required: true,
    },
});

// Create a local copy of the values prop
const currentTitle = ref(props.visualizationTitle);
const currentVisualizationId = ref(props.visualizationId);

// Error message
const message = ref("");
const messageType = ref("");

// Emit an event when values changes
const emit = defineEmits(["update:tracks", "update:settings", "toggle"]);

async function onSave() {
    try {
        if (currentVisualizationId.value) {
            await visualizationsSave(props.root, currentVisualizationId.value, currentTitle.value, {
                dataset_id: props.datasetId,
                settings: props.values,
            });
            message.value = "Successfully saved.";
            messageType.value = "success";
        } else {
            currentVisualizationId.value = await visualizationsCreate(props.root, props.name, currentTitle.value, {
                dataset_id: props.datasetId,
                settings: props.values,
            });
            message.value = "Successfully created.";
            messageType.value = "success";
        }
    } catch (err) {
        message.value = errorMessageAsString(err);
        messageType.value = "error";
    }
}

function onUpdateSettings(newValues) {
    emit("update:settings", newValues);
}

function onUpdateTracks(newValues) {
    emit("update:tracks", newValues);
}
</script>

<template>
    <div class="overflow-auto select-none">
        <div class="flex p-2">
            <div class="flex-1 font-thin text-lg p-1 p-2">Charts</div>
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
                    <div class="m-1">
                        <img v-if="props.logoUrl" :src="props.logoUrl" class="min-w-14 max-w-14 object-contain" />
                        <PresentationChartLineIcon v-else class="size-10" />
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
            <n-input v-model:value="currentTitle" />
        </div>
        <n-tabs type="line" animated class="px-4">
            <n-tab-pane name="settings">
                <template #tab>
                    <n-icon><AdjustmentsHorizontalIcon /></n-icon>
                    <span class="mx-1">Settings</span>
                </template>
                <InputForm
                    :dataset-id="datasetId"
                    :inputs="settingInputs"
                    :root="root"
                    :values="settingValues"
                    @update:values="onUpdateSettings" />
            </n-tab-pane>
            <n-tab-pane name="tracks">
                <template #tab>
                    <n-icon><Square3Stack3DIcon /></n-icon>
                    <span class="mx-1">Tracks</span>
                </template>
                <InputRepeats
                    :dataset-id="datasetId"
                    :inputs="trackInputs"
                    :root="root"
                    :values-array="trackValues"
                    @update:values-array="onUpdateTracks" />
            </n-tab-pane>
        </n-tabs>
    </div>
</template>
