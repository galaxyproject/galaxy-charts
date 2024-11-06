import { GalaxyApi } from "@/api/client";

export async function datasetsGetColumns(datasetId: string, columnList: number[]): Promise<any[][] | undefined> {
    try {
        const params = new URLSearchParams({
            data_type: "raw_data",
            provider: "dataset-column",
            indeces: columnList.toString(),
        }).toString();

        const { data } = await GalaxyApi().GET(`/api/datasets/${datasetId}?${params}`);
        const columnLength = columnList.length;
        const results: any[][] = new Array(columnLength).fill(null).map(() => []);

        for (const row of data) {
            for (const j in row) {
                const index = Number(j);
                const value = row[j];
                if (value !== undefined && value != 2147483647 && index < columnLength) {
                    results[index].push(value);
                }
            }
        }

        return results;
    } catch (err) {
        console.error(err);
        return undefined;
    }
}

export function datasetsGetUrl(datasetId: string): string {
    return `/api/datasets/${datasetId}/display`;
}
