# Introducing the Visualization Framework

Galaxy Visualizations are configured using XML files. The files contain Visualization specific attributes such as the `name`, `description` and the associated npm package details.

```xml
<visualization name="MY_VISUALIZATION">
    <description>MY_DESCRIPTION</description>
    <entry_point src="index.js" css="index.css" />
    ...
</visualization>
```

This XML template includes the following variables:

| Variable | Description |
|----------|-------------|
| **MY_VISUALIZATION** | Specifies the name of the visualization. |
| **MY_DESCRIPTION** | Provides a brief description of the visualization, including references if it’s a third-party plugin. |

## Help

The `<help>` section provides **markdown-formatted documentation** that will be shown inside Galaxy’s user interface when the visualization is launched. Use this to describe the purpose of your visualization, usage instructions, supported data types, and any other relevant guidance.

```xml
<visualization name="MY_VISUALIZATION">
    ...
    <help format="markdown"><![CDATA[
    # What is My Visualization?

    This visualization displays...
    ]]></help>
</visualization>
```

This section supports standard Markdown syntax including headers, lists, links, and inline code.

## Macros

Although less common, you can choose to reuse XML sections by placing them into `macros`. This helps eliminate duplication when the same content is used across multiple XMLs.

Create a macro file e.g. `macro.xml`, and define `macros` like this:

```xml
<macros>
    <xml name="my_macro">
        ...
    </xml>
</macros>
```

In your main XML file, include and reuse the `macros` like this:

```xml
<visualization name="MY_VISUALIZATION">
    <macros>
        <import>macro.xml</import>
    </macros>
    ...
    <expand macro="my_macro"/>
    ...
</visualization>
```
