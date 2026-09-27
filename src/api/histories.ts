import type { ClientType } from "@/types";

const LIMIT = 100;

export function historiesGetContents(
    client: ClientType,
    historyId: string,
    query: string = "",
    extension: string = "",
    limit: number = LIMIT,
) {
    const baseFilter = `q=deleted&qv=false&q=history_content_type&qv=dataset&q=visible&qv=true&`;
    const extensionFilter = extension ? `q=extension-in&qv=${extension}&` : "";
    const nameFilter = query ? `q=name-contains&qv=${query}&` : "";
    return client.api(
        `api/histories/${historyId}/contents?v=dev&order=hid&${baseFilter}${extensionFilter}${nameFilter}limit=${limit}`,
    );
}
