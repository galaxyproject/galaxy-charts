---
title: Introducing the Plugin Framework
description: Galaxy browser plugins are configured using XML files.
---

Galaxy browser plugins are configured using XML files. The files contain plugin specific attributes such as the `name`, `description` and `entry_point`.

```xml
<visualization name="MY_PLUGIN">
    <description>MY_DESCRIPTION</description>
    <entry_point src="index.js" css="index.css" />
    ...
</visualization>
```

This XML template includes the following variables:

| Variable           | Description                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------- |
| **MY_PLUGIN**      | Specifies the name of the plugin.                                                              |
| **MY_DESCRIPTION** | Provides a brief description of the plugin, including references if it's a third-party plugin. |

## Help

The `<help>` section provides **markdown-formatted documentation** that will be shown inside Galaxy's user interface when the plugin is launched. Use this to describe the purpose of your plugin, usage instructions, supported data types, and any other relevant guidance.

```xml
<visualization name="MY_PLUGIN">
    ...
    <help format="markdown"><![CDATA[
    # What is My Plugin?

    This plugin displays...
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
<visualization name="MY_PLUGIN">
    <macros>
        <import>macro.xml</import>
    </macros>
    ...
    <expand macro="my_macro"/>
    ...
</visualization>
```
