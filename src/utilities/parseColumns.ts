interface Dataset {
    metadata_column_types: Record<string, string>;
}

interface Column {
    label: string;
    value: string;
}

export function parseColumns(
    dataset: Dataset,
    isAuto: boolean,
    isText: boolean,
    isNumber: boolean
): Array<Column> {
    const columns: Array<Column> = [];

    if (isAuto) {
        columns.push({ label: "Column: Default", value: "auto" });
    }

    const meta = dataset.metadata_column_types;
    for (const key in meta) {
        if (
            (isNumber && ["int", "float"].includes(meta[key])) ||
            (isText && meta[key] === "str") ||
            (!isNumber && !isText)
        ) {
            columns.push({ label: "Column: " + (parseInt(key) + 1), value: key });
        }
    }

    return columns;
}
