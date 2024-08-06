<script setup>
import { ref, watch } from "vue";
import { ChevronDoubleRightIcon, CloudArrowUpIcon, PresentationChartLineIcon } from "@heroicons/vue/24/outline";
import { NAlert, NButton, NIcon, NInput, NInputNumber, NSelect, NSlider } from "naive-ui";
import { create, save } from "@/utilities/services";

const NUMBER_STEP_SIZE = 0.01;

const props = defineProps({
    datasetId: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        default: "This visualization has no description.",
    },
    inputs: {
        type: Array,
        default: () => [],
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
    title: {
        type: String,
        required: true,
    },
    values: {
        type: Object,
        default: () => {},
    },
});

// Create a local copy of the values prop
const currentTitle = ref(props.title);
const currentValues = ref({ ...props.values });

// Error message
const message = ref("");
const messageType = ref("");

// Emit an event when currentValues changes
const emit = defineEmits(["update:values", "toggle"]);

async function onSave() {
    try {
        await create(props.root, props.name, {
            dataset_id: props.datasetId,
            title: currentTitle.value,
            type: props.type,
            settings: props.values,
        });
        message.value = "Successfully saved.";
        messageType.value = "success";
    } catch (err) {
        message.value = err;
        messageType.value = "error";
    }
}

// Watch and update values
watch(
    currentValues,
    (newValues) => {
        emit("update:values", newValues);
    },
    { deep: true },
);
</script>

<template>
    <div class="overflow-auto">
        <div class="flex p-2">
            <div class="flex-1 font-thin text-lg p-1 md:p-2">Galaxy Charts</div>
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
            <div class="text-xs py-1">Specify a visualization title</div>
            <n-input v-model:value="currentTitle" />
        </div>
        <div v-for="input in inputs" class="px-4 pb-2">
            <div class="font-bold">{{ input.label || input.name }}</div>
            <div v-if="input.help" class="text-xs py-1">{{ input.help }}</div>
            <div v-if="input.name in currentValues">
                <div v-if="input.type === 'select'">
                    <n-select v-model:value="currentValues[input.name]" :options="input.data" />
                </div>
                <div v-if="input.type === 'float'">
                    <n-slider
                        v-if="input.min !== undefined && input.max !== undefined"
                        class="mb-2"
                        v-model:value="currentValues[input.name]"
                        :min="Number(input.min)"
                        :max="Number(input.max)"
                        :step="NUMBER_STEP_SIZE" />
                    <n-input-number
                        v-model:value="currentValues[input.name]"
                        size="small"
                        :min="Number(input.min)"
                        :max="Number(input.max)"
                        :step="NUMBER_STEP_SIZE" />
                </div>
            </div>
        </div>
    </div>
</template>
