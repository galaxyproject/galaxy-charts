# Inputs

You can specify input elements within the `settings` and `tracks` sections, allowing users to parameterize and customize their visualization. Galaxy Charts currently supports the following input types: `boolean`, `color`, `data`, `float`, `integer`, `select`, and `text`.

Below is a template for a generic input element. It includes attributes such as `label`, `help`, `name`, and `type`, along with an optional `data` array used for `select` inputs:

```xml
<input>
    <label>My Input Label</label>
    <help>My Input Help</help>
    <name>my_input_name</name>
    <type>boolean | color | float | integer | select | text</type>
    <data>
        <data>
            <label>My Option 1 Label</label>
            <value>my_option_1</value>
        </data>
        ...
    </data>
</input>
```

## Boolean Input

Boolean inputs are useful to display yes/no options to the user e.g.

```xml
<input>
    <label>My Boolean Label</label>
    <help>My Boolean Help</help>
    <name>my_boolean_name</name>
    <type>boolean</type>
</input>
```

Translates to:

<ClientOnly>
<div class="rounded border p-4">
    <div class="font-bold pb-1">My Boolean Label</div>
    <div class="text-xs pb-1">My Boolean Help</div>
    <n-switch v-model:value="booleanInput"/>
</div>
</ClientOnly>

`my_boolean_name`
<span class="font-thin"> = {{ booleanInput }}</span>

## Color Input
    
Users may also select colors, this can be particular useful to distinguish data tracks e.g. in bar or line diagrams:

```xml
<input>
    <label>My Color Label</label>
    <help>My Color Help</help>
    <name>my_color_name</name>
    <type>color</type>
</input>
```

Translates to:

<ClientOnly>
<div class="rounded border p-4">
    <div class="font-bold pb-1">My Color Label</div>
    <div class="text-xs pb-1">My Color Help</div>
    <n-color-picker
        v-model:value="colorInput"
        :modes="['hex']"
        :show-alpha="false"/>
</div>
</ClientOnly>

`my_color_name`
<span class="font-thin"> = {{ colorInput }}</span>

## Data Input
    
Using a `data` input field you can allow users to select a dataset from Galaxy:

```xml
<input>
    <label>My Data Label</label>
    <help>My Data Help</help>
    <name>my_data_name</name>
    <type>data</type>
</input>
```

Translates to:

<ClientOnly>
<div class="rounded border p-4">
    <div class="font-bold pb-1">My Data Label</div>
    <div class="text-xs pb-1">My Data Help</div>
    <n-select v-model:value="dataInput" :options="dataOptions" filterable />
</div>
</ClientOnly>

`my_data_name`
<span class="font-thin"> = {{ dataInput }}</span>

## Float Input

```xml
<input>
    <label>My Float Label</label>
    <help>My Float Help</help>
    <name>my_float_name</name>
    <type>float</type>
    <min>0</min>
    <max>100</max>
</input>
```

Translates to:

<ClientOnly>
    <div class="rounded border p-4">
        <div class="font-bold pb-1">My Float Label</div>
        <div class="text-xs pb-1">My Float Help</div>
        <n-slider
            class="mb-2"
            v-model:value="floatInput"
            :min="0"
            :max="10"
            :step="0.01" />
        <n-input-number
            v-model:value="floatInput"
            size="small"
            :min="0"
            :max="10"
            :step="0.01" />
    </div>
</ClientOnly>

`my_float_name`
<span class="font-thin"> = {{ floatInput }}</span>

## Integer Input

```xml
<input>
    <label>My Integer Label</label>
    <help>My Integer Help</help>
    <name>my_integer_name</name>
    <type>integer</type>
    <min>0</min>
    <max>100</max>
</input>
```

## Select Input
    
```xml
<input>
    <label>My Select Label</label>
    <help>My Select Help</help>
    <name>my_select_name</name>
    <type>select</type>
    <value>my_option_a</value>
    <data>
        <data>
            <label>My Option A Label</label>
            <value>my_option_a</value>
        </data>
        <data>
            <label>My Option B Label</label>
            <value>my_option_b</value>
        </data>
        ...
    </data>
</input>
```

Translates to:

<ClientOnly>
<div class="rounded border p-4">
    <div class="font-bold pb-1">My Select Label</div>
    <div class="text-xs pb-1">My Select Help</div>
    <n-select v-model:value="selectInput" :options="selectOptions" />
</div>
</ClientOnly>

`my_select_name`
<span class="font-thin"> = {{ selectInput }}</span>

## Text Input

Last but not least, `text` inputs can be declared.

```xml
<input>
    <label>My Text Label</label>
    <help>My Text Help</help>
    <name>my_text_name</name>
    <type>text</type>
</input>
```

Translates to:

<ClientOnly>
    <div class="rounded border p-4">
        <div class="font-bold pb-1">My Text Label</div>
        <div class="text-xs pb-1">My Text Help</div>
        <n-input v-model:value="textInput" />
    </div>
</ClientOnly>

`my_text_name`
<span class="font-thin"> = {{ textInput }}</span>

<script setup>
import * as naiveui from 'naive-ui';
const { NSwitch, NColorPicker, NSelect, NSlider, NInputNumber, NInput } = naiveui;
import { ref } from "vue";
const booleanInput = ref(true);
const colorInput = ref("#0284c7");
const floatInput = ref(1);
const dataInput = ref("dataset_id_a");
const textInput = ref("My Text");
const selectInput = ref("my_option_a");

const dataOptions = [
    {
        label: 'Galaxy Dataset A',
        value: 'dataset_id_a',
    },
    {
        label: 'Galaxy Dataset B',
        value: 'dataset_id_b'
    },
];

const selectOptions = [
    {
        label: 'My Option A',
        value: 'my_option_a',
    },
    {
        label: 'My Option B',
        value: 'my_option_b'
    },
];
</script>