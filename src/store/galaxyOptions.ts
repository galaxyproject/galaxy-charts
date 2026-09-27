import { GalaxyApi } from "@/api/client";
import { getOptions as resolve, HISTORY_LIMIT, type OptionContextType } from "./getOptions";
import type { OptionInputType } from "@/schema/inputOptions";
import type { ClientType, InputOptionType } from "@/types";

export { HISTORY_LIMIT };

/** Option lookups over the connection the config store holds. */
export const galaxyClient: ClientType = {
    async api(path: string) {
        const { data } = await GalaxyApi().GET(`/${path}`);
        return data;
    },
    async url(target: string) {
        const response = await fetch(target);
        if (!response.ok) {
            throw new Error(`Failed to request data json: ${response.status}`);
        }
        return await response.json();
    },
};

/** The values an input may hold, over that connection unless another client is given. */
export function getOptions(
    input: OptionInputType,
    context: Partial<OptionContextType> = {},
): Promise<Array<InputOptionType>> {
    return resolve(input, { client: galaxyClient, ...context });
}
