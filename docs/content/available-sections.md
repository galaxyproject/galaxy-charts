# Available Sections

## Settings Section

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

## Specs Section

The `specs` section contains an `array` of static `key/value` pairs for arbitrary use e.g.
```md
<specs>
    <my_key>my_value</my_key>
    ...
</specs>
```

## Tracks Section

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