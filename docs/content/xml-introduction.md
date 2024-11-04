# XML Wrapper

Galaxy Visualizations are configured using XML files. The files contain Visualization specific attributes such as the `name`, `description` and the associated npm package details.

```xml
<visualization name="MY_VISUALIZATION">
    <description>MY_DESCRIPTION</description>
    <requirements>
        <requirement type="npm" version="MY_NPM_PACKAGE_VERSION" package="MY_NPM_PACKAGE_NAME"/>
    </requirements>
    <entry_point entry_point_type="script" src="dist/index.js" css="dist/index.css" />
    ...
</visualization>
```