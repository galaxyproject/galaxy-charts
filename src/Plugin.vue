<script setup lang="ts">
/** Test Plugin */
import { onMounted, ref, watch } from "vue";
import type { InputValuesType, TranscriptMessageType } from "@/types";
import { useColumnsStore } from "@/store/columnsStore";
import { NButton } from "naive-ui";

const props = defineProps<{
    datasetId: string;
    datasetUrl: string;
    root: string;
    settings: InputValuesType;
    specs: Record<string, string>;
    tracks: Array<InputValuesType>;
    transcripts: Array<TranscriptMessageType>;
}>();

const emit = defineEmits<{
    (event: "save", newSettings: InputValuesType): void;
    (event: "update", newSettings: InputValuesType): void;
}>();

const columnsStore = useColumnsStore();
const columnsList = ref();

async function render() {
    columnsList.value = await columnsStore.fetchColumns(props.datasetId, props.tracks, ["x", "y", "z"]);
    const transcripts = [...props.transcripts];
    if (transcripts.length > 0 && transcripts[transcripts.length - 1].role == "user") {
        transcripts.push({ content: "response", role: "assistant" });
        transcripts.push({
            content: "Do you want to continue?",
            role: "assistant",
            variant: "confirm",
        });
        emit("update", { transcripts });
    }
}

function onSave() {
    emit("save", {
        job_id: "xyz",
        setting_boolean: true,
        setting_conditional: { test_condition: "true", case_true: "set to new value" },
    });
}

function onUpdate() {
    emit("update", {
        job_id: "xyz",
        setting_boolean: true,
        setting_conditional: { test_condition: "true", case_true: "set to new value" },
    });
}

onMounted(() => {
    render();
});

watch(
    () => props,
    () => render(),
    { deep: true },
);
</script>

<template>
    <div class="h-screen overflow-auto">
        <div class="bg-gray-600 text-white p-2">
            <pre class="p-2 whitespace-pre overflow-auto">Settings: {{ settings }}</pre>
            <pre class="p-2 whitespace-pre overflow-auto">Tracks: {{ tracks }}</pre>
            <pre class="p-2 whitespace-pre overflow-auto">Transcripts: {{ transcripts }}</pre>
            <pre class="p-2 whitespace-pre overflow-auto">{{ columnsList }}</pre>
        </div>
        <div class="m-2">
            <n-button type="primary" @click="onSave">Click to Save</n-button>
            <span class="mx-2">
                <n-button type="primary" @click="onUpdate">Click to Update</n-button>
            </span>
        </div>
    </div>
</template>
