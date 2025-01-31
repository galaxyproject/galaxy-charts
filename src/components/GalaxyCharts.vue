<script setup lang="ts">
import { defineProps, computed, nextTick, ref, toRaw } from "vue";
import { ArrowPathIcon, ChevronDoubleLeftIcon } from "@heroicons/vue/24/outline";
import SidePanel from "@/components/SidePanel.vue";
import { parsePlugin } from "@/utilities/parsePlugin";
import { NAlert, NButton, NIcon, NTooltip } from "naive-ui";
import { datasetsGetUrl } from "@/api/datasets";
import { parseIncoming } from "@/utilities/parseIncoming";
import { useConfigStore } from "@/store/configStore";
import { InputElementType, InputValuesType, PluginIncomingType } from "@/types";
import { visualizationsSave } from "@/api/visualizations";

const props = defineProps<{
    container?: string;
    credentials?: RequestCredentials;
    incoming?: PluginIncomingType;
}>();

// Parse incoming visualization details
const { root, visualizationConfig, visualizationId, visualizationPlugin, visualizationTitle } = parseIncoming(
    props.incoming,
    props.container,
);

// References with reactive types
const collapsePanel = ref<boolean>(true);
const description = ref<string>("");
const errorMessage = ref<string>("");
const html = ref<string>("");
const isLoading = ref<boolean>(true);
const logo = ref<string>("");
const name = ref<string>("");
const settingInputs = ref<Array<InputElementType>>([]);
const settingValues = ref<InputValuesType>({});
const specValues = ref<InputValuesType>({});
const trackInputs = ref<Array<InputElementType>>([]);
const trackValues = ref<Array<InputValuesType>>([]);

// Create local copies of props with reactivity
const currentVisualizationId = ref<string | null>(visualizationId);
const currentVisualizationTitle = ref<string>(visualizationTitle);

// Store values in config store
const configStore = useConfigStore();
configStore.setCredentials(props.credentials || "include");
configStore.setRoot(root || "/");

// Collect plugin details and parse incoming settings
parsePlugin(visualizationPlugin, visualizationConfig).then(({ plugin, settings, specs, tracks }) => {
    description.value = plugin.description || "";
    html.value = plugin.html || "";
    isLoading.value = false;
    logo.value = plugin.logo || "";
    name.value = plugin.name || "";
    settingInputs.value = plugin.settings || [];
    settingValues.value = settings;
    specValues.value = specs || {};
    trackInputs.value = plugin.tracks || [];
    trackValues.value = tracks;
});

// Get visualization dataset id
const datasetId = computed(() => visualizationConfig.dataset_id || "");

// Get visualization dataset url
const datasetUrl = computed(() => {
    if (visualizationConfig.dataset_url) {
        console.debug(`GalaxyCharts: Evaluating dataset url: ${visualizationConfig.dataset_url}.`);
        return visualizationConfig.dataset_url;
    } else if (datasetId.value) {
        console.debug(`GalaxyCharts: Built dataset url from dataset id: ${datasetId.value}.`);
        return datasetsGetUrl(root, datasetId.value);
    }
    return null;
});

// Determine logo URL
const logoUrl = computed(() => logo.value && `${root}${logo.value}`);

// Hide panel condition
const hidePanel = computed(() => settingInputs.value.length === 0 && trackInputs.value.length === 0);

// Toggle side panel visibility
async function onToggle(): Promise<void> {
    collapsePanel.value = !collapsePanel.value;
    await nextTick();
    if (window) {
        window.dispatchEvent(new Event("resize"));
    } else {
        console.warn("window unavailable.");
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
async function save(values: InputValuesType) {
    updateSettings({ ...settingValues.value, ...values });
    try {
        const newVisualizationId = await visualizationsSave(
            name.value,
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
</script>

<template>
    <n-alert v-if="errorMessage" type="error" class="m-2">
        {{ errorMessage }}
    </n-alert>
    <n-alert v-if="!datasetUrl" type="info" class="m-2">
        Only displaying available visualization inputs. Rendering requires `dataset_id` or `dataset_url`.
    </n-alert>
    <div v-if="isLoading" class="m-2">
        <span>
            <ArrowPathIcon class="animate-spin size-4 inline mx-1" />
        </span>
        <span class="text-xs">Please wait...</span>
    </div>
    <div v-else class="grid h-screen" :class="{ 'grid-cols-[1fr_17rem]': !collapsePanel && datasetUrl && !hidePanel }">
        <slot
            v-if="datasetUrl"
            :dataset-id="datasetId"
            :dataset-url="datasetUrl"
            :root="root"
            :settings="settingValues"
            :specs="specValues"
            :tracks="trackValues"
            :save="save" />
        <n-tooltip v-if="collapsePanel && datasetUrl && !hidePanel" trigger="hover">
            <template #trigger>
                <n-button strong secondary circle class="bg-sky-100 m-3 absolute right-0" @click="onToggle">
                    <template #icon>
                        <n-icon><ChevronDoubleLeftIcon /></n-icon>
                    </template>
                </n-button>
            </template>
            <span class="text-xs">Expand</span>
        </n-tooltip>
        <SidePanel
            v-else-if="!hidePanel"
            :dataset-id="datasetId"
            :description="description"
            :html="html"
            :logo-url="logoUrl"
            :name="name"
            :setting-inputs="settingInputs"
            :setting-values="settingValues"
            :track-inputs="trackInputs"
            :track-values="trackValues"
            :visualization-id="currentVisualizationId"
            :visualization-title="currentVisualizationTitle"
            @update:settings="updateSettings"
            @update:tracks="updateTracks"
            @update:visualization-id="updateVisualizationId"
            @update:visualization-title="updateVisualizationTitle"
            @toggle="onToggle" />
    </div>
</template>

<style>
@import "@/style.css";
</style>
