<script setup lang="ts">
import { ref } from "vue";
import InputSelect from "@/components/inputs/InputSelect.vue";
import type { OptionInputType } from "@/schema/inputOptions";
import type { InputOptionType } from "@/types";
import { getOptions } from "@/store/galaxyOptions";

type ValueType = {
    id: string;
    name?: string;
};

const props = defineProps<{
    input: OptionInputType;
    optional?: boolean;
    placeholder?: string;
    title?: string;
}>();

const currentOptions = ref<Array<InputOptionType>>([]);
const currentValue = defineModel<ValueType | null>("value");
const loading = ref(false);

async function loadData(): Promise<void> {
    loading.value = true;
    try {
        console.debug("[charts] Requesting data json from:", props.input.url);
        const opts = await getOptions(props.input);
        if (opts.length === 0) {
            console.debug("[charts] No entries found in data json.");
        } else {
            currentOptions.value = opts;
        }
    } catch (err) {
        console.debug("[charts] Failed to request data json.", err);
    } finally {
        loading.value = false;
    }
}

loadData();
</script>

<template>
    <InputSelect
        v-model:value="currentValue"
        :loading="loading"
        :options="currentOptions"
        :optional="props.optional"
        :placeholder="props.placeholder"
        :title="props.title" />
</template>
