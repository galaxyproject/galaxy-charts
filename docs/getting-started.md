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

Galaxy Visualizations are configured using XML files. The files contain Visualization specific attributes such as the `name`, `description` and associated `logo`.

```md
<visualization name="Test Environment" logo="galaxy-charts.svg">
    <description>Welcome to Galaxy Charts.</description>
    ...
</visualization>
```

Additionally, the XML files contain the following optional sections:

***Visualization:Settings***

The `settings` section contains an `array` of `input` elements enabling users to customize the visualization e.g.
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

The following `input.type` options can be listed in the `settings` and `tracks` sections:
 
```md
<input>
    <label>My Text Label</label>
    <name>my_text_input</name>
    <help>Provide your help text here.</help>
    <type>TYPE</type>
</input>
```

***Input:Boolean***
    
```md
<input>
    <label>My Boolean Label</label>
    <name>my_boolean_name</name>
    <help>My Boolean Help</help>
    <type>boolean</type>
</input>
```

***Input:Color***
    
```md
<input>
    <label>My Color Label</label>
    <name>my_color_name</name>
    <help>My Color Help</help>
    <type>color</type>
</input>
```

***Input:Select***
    
```md
<input>
    <label>My Select Label</label>
    <name>my_select_name</name>
    <help>My Select Help</help>
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
    
```md
<input>
    <label>My Text Label</label>
    <name>my_text_name</name>
    <help>My Text Help</help>
    <type>text</type>
</input>
```

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

**Output**

<data_sources>
        <data_source>
            <model_class>HistoryDatasetAssociation</model_class>
            <test type="isinstance" test_attr="datatype" result_type="datatype">tabular.Tabular</test>
            <test type="isinstance" test_attr="datatype" result_type="datatype">tabular.CSV</test>
            <to_param param_attr="id">dataset_id</to_param>
        </data_source>
    </data_sources>
    <params>
        <param type="dataset" var_name_in_template="hda" required="true">dataset_id</param>
    </params>
    <entry_point entry_point_type="chart" src="script.js"/>

::: info
This is an info box.
:::

::: tip
This is a tip.
:::

::: warning
This is a warning.
:::

::: danger
This is a dangerous warning.
:::

::: details
This is a details block.
:::

## More

Check out the documentation for the [full list of markdown extensions](https://vitepress.dev/guide/markdown).
