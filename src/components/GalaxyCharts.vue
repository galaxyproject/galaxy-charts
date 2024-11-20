<script setup lang="ts">
import { computed, ref, nextTick, defineProps } from "vue";
import { ArrowPathIcon, ChevronDoubleLeftIcon } from "@heroicons/vue/24/outline";
import SidePanel from "@/components/SidePanel.vue";
import { parsePlugin } from "@/utilities/parsePlugin";
import { NAlert, NFloatButton, NIcon } from "naive-ui";
import { datasetsGetUrl } from "@/api/datasets";
import { parseIncoming } from "@/utilities/parseIncoming";
import { useConfigStore } from "@/store/configStore";
import { InputElementType, InputValuesType, PluginIncomingType } from "@/types";
import { visualizationsSave } from "@/api/visualizations";

const props = defineProps<{
    credentials?: RequestCredentials;
    incoming?: PluginIncomingType;
}>();

// Parse incoming visualization details
const { root, visualizationConfig, visualizationId, visualizationPlugin, visualizationTitle } = parseIncoming(
    props.incoming,
);

// References with reactive types
const collapsePanel = ref<boolean>(false);
const datasetUrl = ref<string>("");
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

// Get visualization dataset ID (required)
const datasetId = visualizationConfig.dataset_id || "";
if (visualizationConfig.dataset_url) {
    datasetUrl.value = visualizationConfig.dataset_url;
    console.debug(`GalaxyCharts: Evaluating dataset url: ${datasetUrl.value}.`);
} else {
    if (!datasetId) {
        errorMessage.value = "Visualization requires `dataset_id` or `dataset_url`.";
    } else {
        datasetUrl.value = datasetsGetUrl(datasetId);
        console.debug(`GalaxyCharts: Built dataset url from dataset id: ${datasetUrl.value}.`);
    }
}

// Determine logo URL
const logoUrl = computed(() => logo.value && `${root}${logo.value}`);

// Hide panel condition
const hidePanel = computed(() => settingInputs.value.length === 0 && trackInputs.value.length === 0);

// Toggle side panel visibility
async function onToggle(): Promise<void> {
    collapsePanel.value = !collapsePanel.value;
    await nextTick();
    window.dispatchEvent(new Event("resize"));
}

// Event handler for updating settings
function updateSettings(newSettings: InputValuesType): void {
    settingValues.value = { ...newSettings };
}

// Event handler for updating tracks
function updateTracks(newTracks: Array<InputValuesType>): void {
    trackValues.value = [...newTracks];
}

// Event handler for updating visualization id
function updateVisualizationId(newVisualizationId: string): void {
    currentVisualizationId.value = newVisualizationId;
}

// Event handler for updating title
function updateVisualizationTitle(newVisualizationTitle: string): void {
    currentVisualizationTitle.value = newVisualizationTitle;
}

// Event handler for updating settings and saving visualization
async function save(values: InputValuesType) {
    updateSettings({ ...settingValues.value, ...values });
    try {
        const newVisualizationId = await visualizationsSave(name.value, visualizationId, visualizationTitle, {
            dataset_id: datasetId,
            settings: settingValues.value,
            tracks: trackValues.value,
        });
        if (newVisualizationId) {
            updateVisualizationId(newVisualizationId);
        }
    } catch (e) {
        console.error(e);
    }
}
</script>

<template>
    <n-alert v-if="errorMessage" title="Visualization Error!" type="error" class="m-2">
        {{ errorMessage }}
    </n-alert>
    <div v-else-if="isLoading" class="m-2">
        <span>
            <ArrowPathIcon class="animate-spin size-4 inline mx-1" />
        </span>
        <span class="text-xs">Please wait...</span>
    </div>
    <div v-else class="grid h-screen" :class="{ 'grid-cols-[70%_30%]': !collapsePanel && !hidePanel }">
        <slot
            :dataset-id="datasetId"
            :dataset-url="datasetUrl"
            :root="root"
            :settings="settingValues"
            :specs="specValues"
            :tracks="trackValues"
            :save="save" />
        <div v-if="collapsePanel && !hidePanel">
            <n-float-button strong secondary circle class="bg-sky-100 m-2" :top="0" :right="0" @click="onToggle">
                <n-icon><ChevronDoubleLeftIcon /></n-icon>
            </n-float-button>
        </div>
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
