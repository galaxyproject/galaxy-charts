export function parseColumns(dataset, isAuto, isText, isNumber) {
    const columns = [];
    if (isAuto) {
        columns.push({ label: "Column: Default", value: "auto" });
    }
    var meta = dataset.metadata_column_types;
    for (const key in meta) {
        if (
            (isNumber && ["int", "float"].indexOf(meta[key]) != -1) ||
            (isText && meta[key] === "str") ||
            (!isNumber && !isText)
        ) {
            columns.push({ label: "Column: " + (parseInt(key) + 1), value: key });
        }
    }
    return columns;
}
