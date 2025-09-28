import { rethrowSimple } from "@/utilities/simpleError";
import { useConfigStore } from "@/store/configStore";
import type { RequestOptionsType, ResponseType } from "@/types";

let queue = Promise.resolve();

async function fetchApi(path: string, options: RequestInit): ResponseType {
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

function enqueueRequest<T>(fn: () => Promise<T>): Promise<T> {
    const result = queue.then(() => fn());
    queue = result.then(
        () => undefined,
        () => undefined,
    );
    return result;
}

export function GalaxyApi() {
    function GET(path: string): ResponseType {
        return enqueueRequest(() => fetchApi(path, { method: "GET" }));
    }

    function POST(path: string, options: RequestOptionsType): ResponseType {
        return enqueueRequest(() =>
            fetchApi(path, {
                body: JSON.stringify(options),
                method: "POST",
            }),
        );
    }

    function PUT(path: string, options: RequestOptionsType): ResponseType {
        return enqueueRequest(() =>
            fetchApi(path, {
                body: JSON.stringify(options),
                method: "PUT",
            }),
        );
    }

    return {
        GET,
        POST,
        PUT,
    };
}
