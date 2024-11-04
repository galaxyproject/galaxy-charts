# Sections

## Settings Section

The `settings` section includes an `array` of `input` elements that allow users to customize the visualization. These customization options are also available when embedding the visualization in Galaxy workflow reports. Below is an example of a `settings` section with a single `text` input element:

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

## Specs Section

The `specs` section includes an `array` of static `key-value` pairs for general use, such as:

```md
<specs>
    <my_key>my_value</my_key>
    ...
</specs>
```

## Tracks Section

The `tracks` section includes an `array` of `input` elements that allow users to configure individual data tracks, for example:

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