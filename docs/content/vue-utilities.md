# Utilities

Galaxy Charts is bundled with utilities to simplify interaction with Galaxy.

## Column Store

This utility caches and fetches tabular column data from a Galaxy server.

```js
const columnStore = useColumnsStore();
const columnData = await columnStore.fetchColumns(datasetId, tracks, keys);
```
