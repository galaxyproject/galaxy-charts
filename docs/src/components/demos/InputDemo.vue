<script setup lang="ts">
import { ref, computed } from 'vue';
// naive-ui's package.json doesn't expose named ESM exports correctly under
// Node's strict resolver, so use a namespace import (works in dev + SSR).
import * as naiveui from 'naive-ui';
const { NSwitch, NColorPicker, NSelect, NSlider, NInputNumber, NInput } = naiveui;

interface Option {
  label: string;
  value: string;
}

interface Props {
  type:
    | 'boolean'
    | 'color'
    | 'data'
    | 'data_json'
    | 'data_table'
    | 'float'
    | 'integer'
    | 'select'
    | 'text'
    | 'textarea';
  label: string;
  help: string;
  name: string;
  min?: number;
  max?: number;
  step?: number;
  options?: Option[];
  initial?: string | number | boolean;
}

const props = withDefaults(defineProps<Props>(), {
  min: 0,
  max: 10,
  step: 1,
  options: () => [],
});

function defaultValue() {
  if (props.initial !== undefined) return props.initial;
  switch (props.type) {
    case 'boolean':
      return true;
    case 'color':
      return '#0284c7';
    case 'float':
    case 'integer':
      return 1;
    case 'text':
      return 'My Text';
    case 'textarea':
      return 'My Text Area';
    case 'data':
    case 'data_json':
    case 'data_table':
    case 'select':
      return props.options[0]?.value ?? '';
  }
}

const value = ref<string | number | boolean>(defaultValue() as string | number | boolean);

const display = computed(() => {
  if (typeof value.value === 'string') return `"${value.value}"`;
  return String(value.value);
});

const sliderStep = computed(() => (props.type === 'float' ? 0.01 : props.step));
</script>

<template>
  <div class="not-prose">
    <div class="rounded border p-4">
      <div class="font-bold pb-1">{{ label }}</div>
      <div class="text-xs pb-1">{{ help }}</div>

      <NSwitch v-if="type === 'boolean'" v-model:value="value" />

      <NColorPicker
        v-else-if="type === 'color'"
        v-model:value="value"
        :modes="['hex']"
        :show-alpha="false"
      />

      <NSelect
        v-else-if="['select', 'data', 'data_json', 'data_table'].includes(type)"
        v-model:value="value"
        :options="options"
        filterable
      />

      <template v-else-if="type === 'float' || type === 'integer'">
        <NSlider
          class="mb-2"
          v-model:value="value"
          :min="min"
          :max="max"
          :step="sliderStep"
        />
        <NInputNumber
          v-model:value="value"
          size="small"
          :min="min"
          :max="max"
          :step="sliderStep"
        />
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
