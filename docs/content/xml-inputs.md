# Inputs

You can specify input elements within the `settings` and `tracks` sections, allowing users to parameterize and customize their visualization. Galaxy Charts currently supports these input types: `boolean`, `color`, `data`, `data_json`, `data_table`, `float`, `integer`, `select`, `text`, and `textarea`.

Below is a template for a generic input element. It includes `label`, `help`, `name`, and `type` attributes. Additional type-specific options are described in the sections below.

```xml
<input>
    <label>My Input Label</label>
    <help>My Input Help</help>
    <name>my_input_name</name>
    <type>boolean | color | data | data_json | data_table | float | integer | select | text | textarea</type>
    ...
</input>
```

## Boolean

Boolean inputs are useful to display yes/no options to the user.

Example:
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

## Color
    
Users may also select colors, this can be particular useful to distinguish data tracks e.g. in bar or line diagrams.

Example:

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

## Data

You can use a `data` input field to let users select a dataset from Galaxy, with optional filtering by file extension like `bed` or `tabular`. See the [list of supported datatypes](/content/xml-datasources) for details.

| Option        | Type    | Default | Description           |
|---------------|---------|---------|-----------------------|
| **extension** | string  | none    | Filter by extension   |

Example:


```xml
<input>
    <label>My Data Label</label>
    <help>My Data Help</help>
    <name>my_data_name</name>
    <type>data</type>
    <extension>my_data_extension</extension>
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

## Data JSON

A `data_json` input field can load a JSON array of objects from a URL. Each object should have `id` and `name` attributes. Additional `key-value` pairs are allowed. The input populates a select field with these options.

| Option  | Type    | Default | Description                    |
|---------|---------|---------|--------------------------------|
| **url** | string  | none    | URL pointing to the JSON Array |

Example:


```xml
<input>
    <label>My Data JSON</label>
    <help>My Data JSON</help>
    <name>my_data_json_name</name>
    <type>data_json</type>
    <url>my_data_json_url</url>
</input>
```

Translates to:

<ClientOnly>
<div class="rounded border p-4">
    <div class="font-bold pb-1">My Data JSON</div>
    <div class="text-xs pb-1">My Data JSON</div>
    <n-select v-model:value="dataJsonInput" :options="dataJsonOptions" filterable />
</div>
</ClientOnly>

`my_data_json_name`
<span class="font-thin"> = {{ dataJsonInput }}</span>

## Data Table

A `data_table` input field can load tool data tables from Galaxy and present each row as an option to the user. The tables must be publicly accessible.

| Option     | Type    | Default | Description                                              |
|------------|---------|---------|----------------------------------------------------------|
| **tables** | array   | none    | List of publicly accessible Galaxy Tool Data table names |

Example:

```xml
<input>
    <label>My Data Table</label>
    <help>My Data Table</help>
    <name>my_data_table_name</name>
    <type>data_table</type>
    <tables>
        <table>tool_data_table_name</table>
    </tables>
</input>
```

Translates to:

<ClientOnly>
<div class="rounded border p-4">
    <div class="font-bold pb-1">My Data Table</div>
    <div class="text-xs pb-1">My Data Table</div>
    <n-select v-model:value="dataTableInput" :options="dataTableOptions" filterable />
</div>
</ClientOnly>

`my_data_table_name`
<span class="font-thin"> = {{ dataTableInput }}</span>

## Float

`float` inputs support the following options:

| Option  | Type  | Default | Description           |
|---------|-------|---------|-----------------------|
| **min** | float | none    | Minimum allowed value |
| **max** | float | none    | Maximum allowed value |

Example:

```xml
<input>
    <label>My Float Label</label>
    <help>My Float Help</help>
    <name>my_float_name</name>
    <type>float</type>
    <min>0</min>
    <max>10</max>
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

## Integer

`integer` inputs support the following options:

| Option  | Type    | Default | Description           |
|---------|---------|---------|-----------------------|
| **min** | integer | none    | Minimum allowed value |
| **max** | integer | none    | Maximum allowed value |

Example:

```xml
<input>
    <label>My Integer Label</label>
    <help>My Integer Help</help>
    <name>my_integer_name</name>
    <type>integer</type>
    <min>0</min>
    <max>10</max>
</input>
```

Translates to:

<ClientOnly>
    <div class="rounded border p-4">
        <div class="font-bold pb-1">My Integer Label</div>
        <div class="text-xs pb-1">My Integer Help</div>
        <n-slider
            class="mb-2"
            v-model:value="integerInput"
            :min="0"
            :max="10"
            :step="1" />
        <n-input-number
            v-model:value="integerInput"
            size="small"
            :min="0"
            :max="10"
            :step="1" />
    </div>
</ClientOnly>

`my_integer_name`
<span class="font-thin"> = {{ integerInput }}</span>

## Select

You may also declare `select` fields.

| Option         | Type    | Default | Description                               |
|----------------|---------|---------|-------------------------------------------|
| **filterable** | boolean | false   | Enable searching and filtering of options |

Example:

```xml
<input>
    <label>My Select Label</label>
    <help>My Select Help</help>
    <name>my_select_name</name>
    <type>select</type>
    <filterable>false</filterable>
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

## Text

You may also declare `text` inputs.

| Option       | Type    | Default | Description                                                      |
|--------------|---------|---------|------------------------------------------------------------------|
| **deferred** | boolean | false   | Trigger update on every keystroke or only after input completion |

Example:

```xml
<input>
    <label>My Text Label</label>
    <help>My Text Help</help>
    <name>my_text_name</name>
    <type>text</type>
    <deferred>false</deferred>
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

## Text Area

Last but not least, `textarea` inputs can be declared.

```xml
<input>
    <label>My Text Area Label</label>
    <help>My Text Area Help</help>
    <name>my_textarea_name</name>
    <type>textarea</type>
</input>
```

Translates to:

<ClientOnly>
    <div class="rounded border p-4">
        <div class="font-bold pb-1">My Text Area Label</div>
        <div class="text-xs pb-1">My Text Area Help</div>
        <n-input type="textarea" v-model:value="textareaInput" />
    </div>
</ClientOnly>

`my_textarea_name`
<span class="font-thin"> = {{ textareaInput }}</span>

## Conditional

In addition to the atomic inputs described above, you may also define conditional inputs. A conditional input includes a `test_param`, which determines which case-specific `inputs` are displayed. The `test_param` can be of type `boolean` (for two cases) or `select` (for multiple cases). Based on the selected value, the corresponding set of `inputs` defined in the `cases` section will be shown.

The following example demonstrates a conditional input with a boolean `test_param` controlling which inputs are shown.

```xml
<input>
    <label>My Conditional Input</label>
    <help>My Conditional Help</help>
    <name>my_conditional</name>
    <type>conditional</type>
    <test_param>
        <name>my_condition</name>
        <type>boolean</type>
        <value>true</value>
        <data>
            <data>
                <label>My Condition: True</label>
                <value>true</value>
            </data>
            <data>
                <label>My Condition: False</label>
                <value>false</value>
            </data>
        </data>
    </test_param>
    <cases>
        <cases>
            <value>true</value>
            <inputs>
                <inputs>
                    <label>My Text Area Label</label>
                    <help>My Text Area Help</help>
                    <name>my_textarea_name</name>
                    <type>textarea</type>
                </inputs>
                ...
            </inputs>
        </cases>
        <cases>
            <value>false</value>
            <inputs>
                <inputs>
                    <label>My Text Area Label</label>
                    <help>My Text Area Help</help>
                    <name>my_textarea_name</name>
                    <type>textarea</type>
                </inputs>
                ...
            </inputs>
        </cases>
    </cases>
</input>
```

<script setup>
import * as naiveui from 'naive-ui';
const { NSwitch, NColorPicker, NSelect, NSlider, NInputNumber, NInput } = naiveui;
import { ref } from "vue";
const booleanInput = ref(true);
const colorInput = ref("#0284c7");
const dataInput = ref("dataset_id_a");
const dataJsonInput = ref("json_entry_id_a");
const dataTableInput = ref("table_row_1");
const floatInput = ref(1);
const integerInput = ref(1);
const textareaInput = ref("My Text Area");
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

const dataJsonOptions = [
    {
        label: 'JSON Entry Id A',
        value: 'json_entry_id_a',
    },
    {
        label: 'JSON Entry Id B',
        value: 'json_entry_id_b'
    },
];

const dataTableOptions = [
    {
        label: 'Galaxy Table Row 1',
        value: 'table_row_1',
    },
    {
        label: 'Galaxy Table Row 2',
        value: 'table_row_2',
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