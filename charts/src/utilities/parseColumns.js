export function parseColumns(dataset, isAuto, isLabel, isNumeric, isZero) {
    const columns = [];
    if (isAuto) {
        columns.push({ label: "Column: Row Number", value: "auto" });
    }
    if (isZero) {
        columns.push({ label: "Column: None", value: "zero" });
    }
    var meta = dataset.metadata_column_types;
    for (const key in meta) {
        if ((["int", "float"].indexOf(meta[key]) != -1 && isNumeric) || isLabel) {
            columns.push({ label: "Column: " + (parseInt(key) + 1), value: key });
        }
    }
    return columns;
}
