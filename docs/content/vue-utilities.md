# Utilities

Galaxy Charts is bundled with utilities to simplify interaction with Galaxy.

## Function: `fetchColumns`

### Description
Fetches and caches tabular column data from a Galaxy server for use in visualizations. This utility function simplifies access to specific columns within a dataset by retrieving data based on column identifiers provided in the form of keys.

---

### Syntax
```javascript
const store = useColumnsStore();
const response = await store.fetchColumns(datasetId, tracks, keys);
```

### Parameters

| Variable | Type | Description |
|----------|------|-------------|
| **datasetId** | `string` | The unique ID of the tabular dataset on the Galaxy server. |
| **tracks** | `Array<Object>` | An array of track objects, each containing attribute-value pairs where values represent column indices. |
| **keys** | `Array<string>` | An array of attribute names from the tracks array, each specifying a column number to fetch. |

### Return Value

Returns an `Array<Object>`, where each object represents a track with properties defined by the keys in `keys`. Each property contains an array of data from the specified column.

### Example

Here’s an example of using fetchColumns to prepare data for a plot library.

```javascript
// Define input parameters
const datasetId = "Dataset ID of tabular dataset with 4 or more columns"
const tracks [{ color: "blue", name: "Series 1", x: 0, y: 1 },
              { color: "gray", name: "Series 2", x: 2, y: 3 }];
const keys = ["x", "y"];

// Make request to column data provider of Galaxy instance
const store = useColumnsStore();
const response = await store.fetchColumns(datasetId, tracks, keys);

// Prepare results for plotting library
const plotData = [];
response.forEach((columns, index) => {
    const track = props.tracks[index];
    plotData.push({
        marker: {
            color: track.color,
        },
        name: track.name,
        x: columns.x,
        y: columns.y,
    });
});
```

In this example, `columnsList` provides the column data for each track, which is then mapped to `x` and `y` values for plotting. Each track object is styled based on properties like `color` and `name`, before rendering.

### Remarks

- **Galaxy API Dependency**: This function depends on Galaxy's API to retrieve column data, so ensure that you are connected to a Galaxy server.

- **Data Formatting**: The function structures the returned data to align with the attributes specified in keys, simplifying its direct use in visualizations.

- **Caching**: Data is cached for efficient access; repeated calls with the same datasetId, tracks, and keys avoid redundant requests to the server.

This utility is particularly useful for quickly integrating Galaxy’s tabular data with visualization libraries, allowing for flexible and efficient data handling.