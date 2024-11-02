import { rethrowSimple } from "@/utilities/simpleError";
import { useConfigStore } from "@/store/configStore";

async function fetchApi(path, options) {
    const configStore = useConfigStore();
    const routedPath = `${configStore.getRoot()}${path.substring(1)}`;
    try {
        const response = await fetch(routedPath, {
            credentials: process.env.GALAXY_KEY ? "omit" : "include",
            headers: { "Content-Type": "application/json" },
            ...options,
        });
        const data = await response.json();
        return { data };
    } catch (err) {
        rethrowSimple(err);
    }
}

export function GalaxyApi() {
    async function GET(path) {
        return fetchApi(path, {
            method: "GET",
        });
    }
    async function POST(path, options) {
        return fetchApi(path, {
            body: JSON.stringify(options),
            method: "POST",
        });
    }
    async function PUT(path, options) {
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
