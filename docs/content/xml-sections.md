# Sections

Galaxy Charts provides three XML sections: `settings`, `specs`, and `tracks`. These sections allow you to define dynamic input parameters, which users can interact with, or static values to configure your visualization.

- **`settings`**: Contains a single set of input elements displayed to the user for customization.
- **`specs`**: Holds static key/value pairs that configure visualization settings without user interaction.
- **`tracks`**: Includes input elements specific to each data track, allowing customization per track.

Use these sections to tailor the visualization experience based on user input or preset configurations.

## Settings Section

The `settings` section includes an `array` of `input` elements that allow users to customize the visualization. These customization options are also available when embedding the visualization in Galaxy workflow reports. Below is an example of a `settings` section with a single `text` input element:

```xml
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

```xml
<specs>
    <my_key>my_value</my_key>
    ...
</specs>
```

## Tracks Section

The `tracks` section includes an `array` of `input` elements that allow users to configure individual data tracks, for example:

```xml
<tracks>
    <input>
        <label>Track: Color</label>
        <name>track_color</name>
        <type>color</type>
    </input>
    ...
</tracks>
```
