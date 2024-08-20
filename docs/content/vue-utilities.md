# Getting Started

This page demonstrates some of the built-in markdown extensions provided by VitePress.

## Installation

The Galaxy Charts environment is available as Vue3 Library and can be installed through the node package manager:

**Install Galaxy Charts**

```md
npm install galaxy-charts
```

**or alternatively clone the Galaxy Charts Starter-Kit**

The Galaxy Charts Starter-Kit simplifies getting started with your visualization plugin by providing a pre-configured Vite/Vue3 build environment and placeholder files.

```md
git clone https://github.com/guerler/galaxy-charts-starter
```

## Configuration

**Visualization XML**

Galaxy Visualizations are configured using XML files. The files contain Visualization specific attributes such as the `name`, `description` and optionally an associated `logo`.

```md
<visualization name="Test Environment" logo="galaxy-charts.svg">
    <description>Welcome to Galaxy Charts.</description>
    ...
</visualization>
```

Additionally, the XML files contain the following optional sections:

***Visualization:Settings***

The `settings` section contains an `array` of `input` elements enabling users to customize the visualization. These customization options also become available when embedding the visualization in Galaxy workflow reports. Here is an example of a `settings` section with a single `text` input element:
```md
<settings>
    <input>
        <label>Setting: Text</label>
        <name>setting_text</name>
        <type>text</type>
    </input>
    ...
</settings>
```

***Visualization:Specs***

The `specs` section contains an `array` of static `key/value` pairs for arbitrary use e.g.
```md
<specs>
    <my_key>my_value</my_key>
    ...
</specs>
```

***Visualization:Tracks***

The `tracks` section contains an `array` of `input` elements enabling users to configure individual data tracks e.g.
```md
<tracks>
    <input>
        <label>Track: Color</label>
        <name>track_color</name>
        <type>color</type>
    </input>
    ...
</tracks>
```

## Available Input Types

You may specify  `input` elements in the `settings` and `tracks` sections. This will allow users to parameterize and customize their visualization. Currently, Galaxy Charts supports the following input types: `boolean`, `color`, `float`, `integer`, `select`, and `text` input fields.

Here is a generic `input` element template, specifying `label`, `help`, `name`, `type` attributes in addition to an optional `data` array used for `select` inputs:

```md
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


***Input:Boolean***

Boolean inputs are useful to display yes/no options to the user e.g.

```md
<input>
    <label>My Boolean Label</label>
    <help>My Boolean Help</help>
    <name>my_boolean_name</name>
    <type>boolean</type>
</input>
```

Translates to:

<div class="rounded border p-4">
    <div class="font-bold pb-1">My Boolean Label</div>
    <div class="text-xs pb-1">My Boolean Help</div>
    <n-switch v-model:value="booleanInput"/>
</div>

`my_boolean_name`
<span class="font-thin"> = {{ booleanInput }}</span>

***Input:Color***
    
Users may also select colors, this can be particular useful to distinguish data tracks e.g. in bar or line diagrams:

```md
<input>
    <label>My Color Label</label>
    <help>My Color Help</help>
    <name>my_color_name</name>
    <type>color</type>
</input>
```
Translates to:


`my_color_name`
<span class="font-thin"> = {{ colorInput }}</span>

***Input:Float***

```md
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

`my_float_name`
<span class="font-thin"> = {{ floatInput }}</span>

***Input:Integer***

```md
<input>
    <label>My Integer Label</label>
    <help>My Integer Help</help>
    <name>my_integer_name</name>
    <type>integer</type>
    <min>0</min>
    <max>100</max>
</input>
```

***Input:Select***
    
```md
<input>
    <label>My Select Label</label>
    <help>My Select Help</help>
    <name>my_select_name</name>
    <type>select</type>
    <value>my_option_1</value>
    <data>
        <data>
            <label>My Option 1 Label</label>
            <value>my_option_1</value>
        </data>
        <data>
            <label>My Option 2 Label</label>
            <value>my_option_2</value>
        </data>
        ...
    </data>
</input>
```

***Input:Text***

Last but not least, `text` inputs can be declared.

```md
<input>
    <label>My Text Label</label>
    <help>My Text Help</help>
    <name>my_text_name</name>
    <type>text</type>
</input>
```

Translates to:

<div class="rounded border p-4">
    <div class="font-bold pb-1">My Text Label</div>
    <div class="text-xs pb-1">My Text Help</div>
    <n-input v-model:value="textInput" />
</div>

`my_text_name`
<span class="font-thin"> = {{ textInput }}</span>

**Example**
```md
<visualization name="Test Environment" logo="galaxy-charts.svg">
    <description>Welcome to Galaxy Charts.</description>
    <specs>
        <type>spec_type</type>
    </specs>
    <tracks>
        <input>
            <label>Track: Color</label>
            <name>track_color</name>
            <type>color</type>
        </input>
        <input>
            <label>Track: Text</label>
            <name>track_text</name>
            <type>text</type>
            <placeholder>Placeholder</placeholder>
            <value>Text</value>
        </input>
        <input>
            <name>track_column_0</name>
            <label>Track: Column (Auto, Text)</label>
            <type>data_column</type>
            <is_auto>true</is_auto>
            <is_text>true</is_text>
        </input>
        <input>
            <name>track_column_1</name>
            <label>Track: Column (Number)</label>
            <type>data_column</type>
            <is_number>true</is_number>
        </input>
    </tracks>
    <settings>
        <input>
            <label>Setting: Text</label>
            <name>setting_text</name>
            <type>text</type>
            <optional>true</optional>
        </input>
        <input>
            <label>Setting: Boolean</label>
            <name>setting_boolean</name>
            <type>boolean</type>
            <optional>true</optional>
        </input>
    </settings>
</visualization>
```

# Vue

```js{4}
<script setup>
import { ViewPort } from "galaxy-charts";
import Plugin from "@/Plugin.vue";
const config = {
    dataset_url: "galaxy-charts.txt",
    settings: {
        setting_text: "My Test Setting",
        setting_boolean: true,
    },
};
</script>

<template>
    <ViewPort :config="config" xml="galaxy-charts.xml">
        <template #default="{ datasetId, datasetUrl, root, settings, specs, tracks }">
            // Place your plugin code here!
        </template>
    </ViewPort>
</template>

```
