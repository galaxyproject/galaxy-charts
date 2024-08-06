<script setup>
import axios from "axios";
import { ArrowPathIcon, ChevronDoubleLeftIcon } from "@heroicons/vue/24/outline";
import SidePanel from "@/components/SidePanel.vue";
import { parseXML } from "@/utilities/parseXML";
import { computed, ref, nextTick } from "vue";
import { NAlert, NFloatButton, NIcon } from "naive-ui";

// props
const props = defineProps({
    config: {
        type: Object,
        default: () => {},
    },
    xml: {
        type: String,
        required: true,
    },
});

// references
const errorMessage = ref("");
const datasetUrl = ref(null);
const description = ref(null);
const html = ref(null);
const inputs = ref([]);
const isLoading = ref(true);
const logo = ref(null);
const name = ref(null);
const embedded = ref(false);
const values = ref({});

// access attached data
const element = document.getElementById("app");
const incoming = JSON.parse(element.getAttribute("data-incoming")) || {};

// parse root
const root = ref(incoming.root || "/");
const visualizationTitle = incoming.visualization_title || "New Chart";
const visualizationId = incoming.visualization_id;

// evaluated computed values
const logoUrl = computed(() => `${root.value}${logo.value}`);

// get stored visualization config
let visualizationConfig = incoming.visualization_config || props.config;

// parse chart dict
if (incoming.visualization_config?.chart_dict) {
    const chartDict = incoming.visualization_config.chart_dict;
    visualizationConfig.groups = chartDict.groups;
    visualizationConfig.settings = chartDict.settings;
    delete visualizationConfig["chartDict"];
}

// get visualization plugin details
const visualizationPlugin = incoming.visualization_plugin;

// get visualization title
const datasetId = visualizationConfig.dataset_id;

// build dataset url
if (visualizationConfig.dataset_url) {
    datasetUrl.value = visualizationConfig.dataset_url;
    console.debug(`ViewPort: Found dataset url: ${datasetUrl.value}.`);
} else {
    if (!datasetId) {
        errorMessage.value = "Visualization requires `dataset_id` or `dataset_url`.";
    } else {
        datasetUrl.value = `${root.value}api/datasets/${datasetId}/display`;
        console.debug(`ViewPort: Built dataset url from dataset id: ${datasetUrl.value}.`);
    }
}

// parse plugin either from incoming object or xml
const visualizationSettings = visualizationConfig.settings || {};
if (visualizationPlugin) {
    parseConfig(visualizationPlugin, visualizationSettings);
} else if (props.xml) {
    axios.get(props.xml).then((response) => {
        parseConfig(parseXML(props.xml, response.data), visualizationSettings);
    });
} else {
    errorMessage.value = "Visualization requires configuration from XML or attached `visualization_plugin` details.";
}

// Parse plugin configuration
function parseConfig(plugin, settings) {
    name.value = plugin.name;
    html.value = plugin.html;
    description.value = plugin.description;
    logo.value = plugin.logo;
    if (plugin.settings) {
        inputs.value = plugin.settings;
        inputs.value.forEach((input) => {
            let value = settings[input.name] ?? input.value;
            if (input.type === "float") {
                value = Number(value);
            }
            values.value[input.name] = value;
        });
    }
    isLoading.value = false;
}

async function onToggle() {
    embedded.value = !embedded.value;
    await nextTick();
    window.dispatchEvent(new Event("resize"));
}

// Event handler for updating values
function updateValues(newValues) {
    values.value = { ...newValues };
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
    <div v-else class="grid h-screen" :class="{ 'grid-cols-[70%_30%]': !embedded }">
        <slot :settings="values" :dataset-url="datasetUrl" :embedded="embedded" />
        <div v-if="embedded">
            <n-float-button strong secondary circle class="bg-sky-100 m-2" :top="0" :right="0" @click="onToggle">
                <n-icon><ChevronDoubleLeftIcon /></n-icon>
            </n-float-button>
        </div>
        <SidePanel
            v-else
            :dataset-id="datasetId"
            :description="description"
            :html="html"
            :inputs="inputs"
            :logo-url="logoUrl"
            :name="name"
            :root="root"
            :values="values"
            :visualization-id="visualizationId"
            :visualization-title="visualizationTitle"
            @update:values="updateValues"
            @toggle="onToggle" />
    </div>
</template>
