import { GalaxyApi } from "@/api/client";
import { rethrowSimple } from "@/utilities/simpleError";

/** Column value can be a string or number */
export type ColumnValueType = string | number;

export async function datasetsGetColumns(
    datasetId: string,
    columnList: string[],
): Promise<ColumnValueType[][] | undefined> {
    const params = new URLSearchParams({
        data_type: "raw_data",
        provider: "dataset-column",
        indeces: columnList.toString(),
    }).toString();

    try {
        const { data } = await GalaxyApi().GET(`/api/datasets/${datasetId}?${params}`);
        if (data.data && data.data.length > 0) {
            const columnLength = columnList.length;
            const results: ColumnValueType[][] = Array.from({ length: columnLength }, () => []);
            for (const row of data.data) {
                for (const j in row) {
                    const index = Number(j);
                    const value = row[j];
                    // Every column takes one entry per row, so the series stay aligned. A cell
                    // Galaxy could not read comes back as null and is kept as a gap.
                    if (value !== undefined && index < columnLength) {
                        results[index].push(value);
                    }
                }
            }
            return results;
        } else {
            return [];
        }
    } catch (e) {
        rethrowSimple(e);
    }
}

export function datasetsGetUrl(root: string, datasetId: string): string {
    return `${root}api/datasets/${datasetId}/display`;
}
