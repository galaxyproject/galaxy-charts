import { describe, test, expect } from "vitest";
import { parseColumns } from "./parseColumns";

const mockDataset = {
    metadata_column_types: {
        0: "int",
        1: "str",
        2: "float",
        3: "bool",
    },
};

describe("parseColumns", () => {
    test("Returns default column when isAuto is true", () => {
        const result = parseColumns(mockDataset, true, false, false);
        expect(result).toEqual([
            { label: "Column: Default", value: "auto" },
            { label: "Column: 1", value: "0" },
            { label: "Column: 2", value: "1" },
            { label: "Column: 3", value: "2" },
            { label: "Column: 4", value: "3" },
        ]);
    });

    test("Parses only numeric columns when isNumber is true", () => {
        const result = parseColumns(mockDataset, false, false, true);
        expect(result).toEqual([
            { label: "Column: 1", value: "0" },
            { label: "Column: 3", value: "2" },
        ]);
    });

    test("Parses only text columns when isText is true", () => {
        const result = parseColumns(mockDataset, false, true, false);
        expect(result).toEqual([{ label: "Column: 2", value: "1" }]);
    });

    test("Parses all columns when neither isNumber nor isText is true", () => {
        const result = parseColumns(mockDataset, false, false, false);
        expect(result).toEqual([
            { label: "Column: 1", value: "0" },
            { label: "Column: 2", value: "1" },
            { label: "Column: 3", value: "2" },
            { label: "Column: 4", value: "3" },
        ]);
    });

    test("Parses all columns including auto when isAuto is true", () => {
        const result = parseColumns(mockDataset, true, false, false);
        expect(result).toEqual([
            { label: "Column: Default", value: "auto" },
            { label: "Column: 1", value: "0" },
            { label: "Column: 2", value: "1" },
            { label: "Column: 3", value: "2" },
            { label: "Column: 4", value: "3" },
        ]);
    });

    test("Returns empty array when dataset has no metadata_column_types", () => {
        const result = parseColumns({ metadata_column_types: {} }, false, false, false);
        expect(result).toEqual([]);
    });
});
