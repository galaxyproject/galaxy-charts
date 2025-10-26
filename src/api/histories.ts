import { GalaxyApi } from "@/api/client";
import { rethrowSimple } from "@/utilities/simpleError";

const LIMIT = 100;

export async function historiesGetContents(
    historyId: string,
    query: string = "",
    extension: string = "",
    limit: number = LIMIT,
) {
    const filter = { deleted: false, history_content_type: "dataset", visible: true };
    const baseFilter =
        Object.entries(filter)
            .map(([k, v]) => `q=${k}&qv=${v}`)
            .join("&") + "&";
    const extensionFilter = extension ? `q=extension-eq&qv=${extension}&` : "";
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
