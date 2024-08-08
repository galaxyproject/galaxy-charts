<script setup>
import { ref, watch } from "vue";
import { ChevronDoubleRightIcon, CloudArrowUpIcon, PresentationChartLineIcon } from "@heroicons/vue/24/outline";
import { NAlert, NButton, NIcon, NInput } from "naive-ui";
import { visualizationsCreate, visualizationsSave } from "@/api/visualizations";
import InputForm from "@/components/InputForm.vue";

const MESSAGE_TIMEOUT = 2000;

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
const emit = defineEmits(["update:values", "toggle"]);

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
        message.value = err;
        messageType.value = "error";
    }
}

function onUpdateSettings(newValues) {
    emit("update:settings", newValues);
}

// Watch and clear messages
let clearMessage = null;
watch(message, () => {
    clearMessage && clearTimeout(clearMessage);
    clearMessage = setTimeout(() => (message.value = ""), MESSAGE_TIMEOUT);
});
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
        <n-alert v-if="message" :type="messageType" class="m-4">
            {{ message }}
        </n-alert>
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
        <InputForm :inputs="settingInputs" :values="settingValues" @update:values="onUpdateSettings" />
    </div>
</template>
