<script setup lang="ts">
import { ref } from "vue";
import InputSelect from "@/components/inputs/InputSelect.vue";
import type { OptionInputType } from "@/schema/inputOptions";
import type { InputOptionType } from "@/types";
import { getOptions } from "@/store/galaxyOptions";

type ValueType = {
    id: string;
    columns: Array<string>;
    row: Array<string>;
    table: string;
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
        currentOptions.value = await getOptions(props.input);
    } catch (err) {
        console.debug("[charts] Failed to request data table.", err);
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
        :optional="optional"
        :placeholder="placeholder"
        :sort="true"
        :title="title" />
</template>
