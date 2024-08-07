<script setup>
import { ArrowPathIcon, ChevronDoubleLeftIcon } from "@heroicons/vue/24/outline";
import SidePanel from "@/components/SidePanel.vue";
import { parsePlugin } from "@/utilities/parsePlugin";
import { computed, ref, nextTick } from "vue";
import { NAlert, NFloatButton, NIcon } from "naive-ui";
import { getDatasetUrl } from "@/api/datasets";
import { parseIncoming } from "@/utilities/parseIncoming";

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
const name = ref("");
const embedded = ref(false);
const values = ref({});

// parse incoming visualization details
const { root, visualizationConfig, visualizationId, visualizationPlugin, visualizationTitle } = parseIncoming(
    props.config,
);

// collect plugin details and parse incoming settings
parsePlugin(props.xml, visualizationPlugin, visualizationConfig).then(({ plugin, settings, tracks }) => {
    description.value = plugin.description;
    html.value = plugin.html;
    inputs.value = plugin.settings;
    isLoading.value = false;
    logo.value = plugin.logo;
    name.value = plugin.name;
    values.value = settings;
});

// get visualization dataset id (required)
const datasetId = visualizationConfig.dataset_id;
if (visualizationConfig.dataset_url) {
    datasetUrl.value = visualizationConfig.dataset_url;
    console.debug(`ViewPort: Found dataset url: ${datasetUrl.value}.`);
} else {
    if (!datasetId) {
        errorMessage.value = "Visualization requires `dataset_id` or `dataset_url`.";
    } else {
        datasetUrl.value = getDatasetUrl(root, datasetId);
        console.debug(`ViewPort: Built dataset url from dataset id: ${datasetUrl.value}.`);
    }
}

// determine logo url
const logoUrl = computed(() => `${root}${logo.value}`);

// toggle side panel
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
