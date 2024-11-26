import { rethrowSimple } from "@/utilities/simpleError";
import { useConfigStore } from "@/store/configStore";

async function fetchApi(path: string, options: RequestInit): Promise<{ data: any; response: Response }> {
    const configStore = useConfigStore();
    const routedPath = `${configStore.getRoot()}${path.substring(1)}`;
    try {
        const response = await fetch(routedPath, {
            credentials: configStore.getCredentials(),
            headers: { "Content-Type": "application/json" },
            ...options,
        });
        if (response.ok) {
            const data = await response.json();
            return { data, response };
        } else {
            rethrowSimple(response);
        }
    } catch (err) {
        rethrowSimple(err);
    }
}

export function GalaxyApi() {
    async function GET(path: string): Promise<{ data: any; response: Response }> {
        return fetchApi(path, {
            method: "GET",
        });
    }

    async function POST(path: string, options: any): Promise<{ data: any; response: Response }> {
        return fetchApi(path, {
            body: JSON.stringify(options),
            method: "POST",
        });
    }

    async function PUT(path: string, options: any): Promise<{ data: any; response: Response }> {
        return fetchApi(path, {
            body: JSON.stringify(options),
            method: "PUT",
        });
    }

    return {
        GET,
        POST,
        PUT,
    };
}
