import { GalaxyApi } from "@/api/client";
import { rethrowSimple } from "@/utilities/simpleError";

const LIMIT = 100;

export async function historiesGetContents(
    historyId: string,
    query: string = "",
    extension: string = "",
    limit: number = LIMIT,
) {
    const baseFilter = `q=deleted&qv=false&q=history_content_type&qv=dataset&q=visible&qv=true&`;
    const extensionFilter = extension ? `q=extension-in&qv=${extension}&` : "";
    const nameFilter = query ? `q=name-contains&qv=${query}&` : "";
    try {
        const { data } = await GalaxyApi().GET(
            `/api/histories/${historyId}/contents?v=dev&order=hid&${baseFilter}${extensionFilter}${nameFilter}limit=${limit}`,
        );
        return data;
    } catch (e) {
        rethrowSimple(e);
    }
}
