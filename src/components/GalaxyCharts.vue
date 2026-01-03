<script setup lang="ts">
import { NAlert } from "naive-ui";
import { computed, nextTick, ref, watch } from "vue";
import { ArrowPathIcon, ChevronDoubleLeftIcon } from "@heroicons/vue/24/outline";
import { datasetsGetUrl } from "@/api/datasets";
import { visualizationsSave } from "@/api/visualizations";
import SideButton from "@/components/SideButton.vue";
import SidePanel from "@/components/SidePanel.vue";
import { useConfigStore } from "@/store/configStore";
import { InputElementType, InputValuesType, PluginIncomingType, TranscriptMessageType } from "@/types";
import { parsePlugin } from "@/utilities/parsePlugin";
import { parseIncoming } from "@/utilities/parseIncoming";
import { toBoolean } from "@/utilities/toBoolean";

import "@/style.css";

const props = withDefaults(
    defineProps<{
        collapse?: boolean;
        container?: string;
        credentials?: RequestCredentials;
        incoming?: PluginIncomingType;
    }>(),
    {
        collapse: true,
    },
);

// Parse incoming visualization details
const { root, visualizationConfig, visualizationId, visualizationPlugin, visualizationTitle } = parseIncoming(
    props.incoming,
    props.container,
);

// References with reactive types
const collapsePanel = ref<boolean>(props.collapse);
const errorMessage = ref<string>("");
const isLoading = ref<boolean>(true);
const pluginDescription = ref<string>("");
const pluginHtml = ref<string>("");
const pluginLogo = ref<string>("");
const pluginName = ref<string>("");
const settingInputs = ref<Array<InputElementType>>([]);
const settingValues = ref<InputValuesType>({});
const specValues = ref<InputValuesType>({});
const trackInputs = ref<Array<InputElementType>>([]);
const trackValues = ref<Array<InputValuesType>>([]);
const transcriptValues = ref<Array<TranscriptMessageType>>([]);

// Create local copies of props with reactivity
const currentVisualizationId = ref<string | null>(visualizationId);
const currentVisualizationTitle = ref<string>(visualizationTitle);

// Store values in config store
const configStore = useConfigStore();
configStore.setCredentials(props.credentials || "include");
configStore.setRoot(root || "/");

// Collect plugin details and parse incoming settings
parsePlugin(visualizationPlugin, visualizationConfig).then(({ plugin, settings, specs, tracks, transcripts }) => {
    isLoading.value = false;
    pluginDescription.value = plugin.description || "";
    pluginHtml.value = plugin.html || "";
    pluginLogo.value = plugin.logo || "";
    pluginName.value = plugin.name || "";
    settingInputs.value = plugin.settings || [];
    settingValues.value = settings;
    specValues.value = specs || {};
    trackInputs.value = plugin.tracks || [];
    trackValues.value = tracks;
    transcriptValues.value = transcripts;
});

// Get visualization dataset id
const datasetId = computed(() => visualizationConfig.dataset_id || "");

// Get visualization dataset url
const datasetUrl = computed(() => {
    if (datasetId.value) {
        console.debug(`[charts] Built dataset url from dataset id: ${datasetId.value}.`);
        return datasetsGetUrl(root, datasetId.value);
    }
    return "";
});

// Identify available tabs
const hasChat = computed(() => toBoolean(specValues.value.ui?.chat));
const hasDataset = computed(() => !!datasetId.value);
const hasSettings = computed(() => settingInputs.value.length > 0);
const hasTracks = computed(() => trackInputs.value.length > 0);

// Determine wether the panel should be shown
const hasPanel = computed(() => hasChat.value || hasSettings.value || hasTracks.value);

// Determine logo URL
const logoUrl = computed(() => pluginLogo.value && `${root}${pluginLogo.value}`);

// Toggle side panel visibility
async function onToggle(): Promise<void> {
    collapsePanel.value = !collapsePanel.value;
    await nextTick();
    if (window) {
        window.dispatchEvent(new Event("resize"));
    } else {
        console.warn("[charts] window unavailable.");
    }
}

// Send a message to the parent container
function postMessage() {
    try {
        window.postMessage(
            {
                container: props.container,
                from: "galaxy-visualization",
                visualization_config: JSON.parse(JSON.stringify(serialize())),
                visualization_id: currentVisualizationId.value,
                visualization_title: currentVisualizationTitle.value,
            },
            "*",
        );
    } catch (e) {
        errorMessage.value = `Failed to postMessage: ${e}`;
    }
}

// Serialize state
function serialize() {
    return {
        dataset_id: datasetId.value,
        settings: settingValues.value,
        tracks: trackValues.value,
        transcripts: transcriptValues.value,
    };
}

// Event handler for updating settings
function updateSettings(newSettings: InputValuesType): void {
    settingValues.value = { ...newSettings };
    postMessage();
}

// Event handler for updating tracks
function updateTracks(newTracks: Array<InputValuesType>): void {
    trackValues.value = [...newTracks];
    postMessage();
}

// Event handler for updating transcripts
function updateTranscripts(newTranscripts: TranscriptMessageType[]): void {
    transcriptValues.value = [...newTranscripts];
    postMessage();
}

// Event handler for updating visualization id
function updateVisualizationId(newVisualizationId: string): void {
    currentVisualizationId.value = newVisualizationId;
    postMessage();
}

// Event handler for updating title
function updateVisualizationTitle(newVisualizationTitle: string): void {
    currentVisualizationTitle.value = newVisualizationTitle;
    postMessage();
}

// Event handler for updating settings and saving visualization
async function save({
    settings,
    tracks,
    transcripts,
}: {
    settings?: InputValuesType;
    tracks?: Array<InputValuesType>;
    transcripts?: Array<TranscriptMessageType>;
}) {
    update({ settings, tracks, transcripts });
    try {
        const newVisualizationId = await visualizationsSave(
            pluginName.value,
            currentVisualizationId.value,
            currentVisualizationTitle.value,
            serialize(),
        );
        if (newVisualizationId) {
            updateVisualizationId(newVisualizationId);
        }
    } catch (e) {
        errorMessage.value = `Failed to save: ${e}`;
    }
}

// Event handler for updating settings and tracks
function update({
    collapse,
    settings,
    tracks,
    transcripts,
}: {
    collapse?: boolean;
    settings?: InputValuesType;
    tracks?: Array<InputValuesType>;
    transcripts?: Array<TranscriptMessageType>;
}) {
    if (collapse) {
        collapsePanel.value = collapse;
    }
    if (settings) {
        updateSettings({ ...settingValues.value, ...settings });
    }
    if (tracks) {
        const nTracks = Math.max(trackValues.value.length, tracks.length);
        const mergedTracks: Array<InputValuesType> = Array.from({ length: nTracks }, (_, i) => {
            const originalTrack = trackValues.value[i] ?? {};
            const incomingTrack = tracks[i] ?? {};
            return { ...originalTrack, ...incomingTrack };
        });
        updateTracks(mergedTracks);
    }
    if (transcripts) {
        updateTranscripts([...transcripts]);
    }
}
</script>

<template>
    <div v-if="errorMessage" class="m-2">
        <n-alert type="error">
            {{ errorMessage }}
        </n-alert>
    </div>
    <div v-if="isLoading" class="m-2">
        <span>
            <ArrowPathIcon class="animate-spin size-4 inline mx-1" />
        </span>
        <span class="text-xs">Please wait...</span>
    </div>
    <div v-else class="grid h-screen" :class="{ 'grid-cols-[1fr_20rem]': !collapsePanel && hasPanel && hasDataset }">
        <div v-if="datasetId" class="relative max-w-full h-screen overflow-hidden">
            <slot
                :dataset-id="datasetId"
                :dataset-url="datasetUrl"
                :root="root"
                :settings="settingValues"
                :specs="specValues"
                :tracks="trackValues"
                :transcripts="transcriptValues"
                :save="save"
                :update="update" />
        </div>
        <SideButton
            v-if="collapsePanel && hasPanel && hasDataset"
            button-class="m-2 absolute right-0 z-[9999]"
            :circle="true"
            :icon="ChevronDoubleLeftIcon"
            title="Expand"
            @click="onToggle" />
        <SidePanel
            v-if="(!collapsePanel && hasPanel) || !hasDataset"
            :dataset-id="datasetId"
            :logo-url="logoUrl"
            :plugin-description="pluginDescription"
            :plugin-html="pluginHtml"
            :plugin-name="pluginName"
            :setting-inputs="settingInputs"
            :setting-values="settingValues"
            :spec-values="specValues"
            :track-inputs="trackInputs"
            :track-values="trackValues"
            :transcript-values="transcriptValues"
            :visualization-id="currentVisualizationId"
            :visualization-title="currentVisualizationTitle"
            @update:settings="updateSettings"
            @update:tracks="updateTracks"
            @update:transcripts="updateTranscripts"
            @update:visualization-id="updateVisualizationId"
            @update:visualization-title="updateVisualizationTitle"
            @toggle="onToggle" />
    </div>
</template>
