<script setup lang="ts">
import { ref, computed, defineAsyncComponent } from "vue";

// naive-ui components are loaded lazily on the client to avoid SSR resolver
// quirks with named exports. NColorPicker is used in *uncontrolled* mode
// (default-value + @update:value) because the controlled v-model path tripped
// on the async-component hand-off (`color.includes is not a function`).
const NSwitch = defineAsyncComponent(() => import("naive-ui").then((m) => m.NSwitch));
const NColorPicker = defineAsyncComponent(() => import("naive-ui").then((m) => m.NColorPicker));
const NSelect = defineAsyncComponent(() => import("naive-ui").then((m) => m.NSelect));
const NSlider = defineAsyncComponent(() => import("naive-ui").then((m) => m.NSlider));
const NInputNumber = defineAsyncComponent(() => import("naive-ui").then((m) => m.NInputNumber));
const NInput = defineAsyncComponent(() => import("naive-ui").then((m) => m.NInput));

interface Option {
    label: string;
    value: string;
}

type InputType =
    | "boolean"
    | "color"
    | "data"
    | "data_json"
    | "data_table"
    | "float"
    | "integer"
    | "select"
    | "text"
    | "textarea";

interface Props {
    type: InputType;
    label: string;
    help: string;
    name: string;
    min?: number;
    max?: number;
    step?: number;
    options?: Option[];
}

const props = withDefaults(defineProps<Props>(), {
    min: 0,
    max: 10,
    step: 1,
    options: () => [],
});

// Per-type initial values — kept as a single switch so the rules are obvious.
function initialValue() {
    switch (props.type) {
        case "boolean":
            return true;
        case "color":
            return "#E30A17";
        case "float":
        case "integer":
            return 0;
        case "text":
            return "My Text";
        case "textarea":
            return "My Text Area";
        case "data":
        case "data_json":
        case "data_table":
        case "select":
            return props.options[0]?.value ?? "";
    }
}

// One ref shared by all input variants. Typed as `any` because each variant
// uses a different naive-ui control with its own narrow prop type — runtime
// values are always the right shape per the `initialValue()` switch above.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const value = ref<any>(initialValue());

const display = computed(() => {
    const v = value.value;
    if (typeof v === "string") return `"${v}"`;
    return String(v);
});

const sliderStep = computed(() => (props.type === "float" ? 0.01 : props.step));
const isSelectKind = computed(() => ["select", "data", "data_json", "data_table"].includes(props.type));
</script>

<template>
    <div class="not-prose">
        <div class="rounded border p-4">
            <div class="font-bold pb-1">{{ label }}</div>
            <div class="text-xs pb-1">{{ help }}</div>

            <NSwitch v-if="type === 'boolean'" v-model:value="value" />

            <NColorPicker
                v-else-if="type === 'color'"
                :default-value="String(value)"
                :show-alpha="false"
                @update:value="(v: string) => (value = v)" />

            <NSelect v-else-if="isSelectKind" v-model:value="value" :options="options as any" filterable />

            <template v-else-if="type === 'float' || type === 'integer'">
                <NSlider class="mb-2" v-model:value="value" :min="min" :max="max" :step="sliderStep" />
                <NInputNumber v-model:value="value" size="small" :min="min" :max="max" :step="sliderStep" />
            </template>

            <NInput v-else-if="type === 'textarea'" type="textarea" v-model:value="value" />
            <NInput v-else-if="type === 'text'" v-model:value="value" />
        </div>
        <p class="mt-2 text-sm">
            <code class="px-1.5 py-0.5 rounded bg-gray-100 text-xs">{{ name }}</code>
            <span class="font-thin"> = {{ display }}</span>
        </p>
    </div>
</template>
