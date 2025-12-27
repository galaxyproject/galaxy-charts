import { rethrowSimple } from "@/utilities/simpleError";

export type Role = "user" | "assistant" | "system";

export interface CompletionsPayload {
    aiApiKey: string;
    aiBaseUrl: string;
    aiMaxTokens?: number;
    aiModel: string;
    aiTemperature?: number;
    aiTopP?: number;
    messages: CompletionsMessage[];
}

export interface CompletionsMessage {
    id: number;
    role: Role;
    content: string;
}

const MAX_TOKENS = 1000;
const TEMPERATURE = 0.3;
const TOP_P = 0.8;

function normalize(v: number | undefined, min: number, max: number, fallback: number) {
    if (v == null) {
        return fallback;
    } else {
        if (v < min) {
            return min;
        } else {
            if (v > max) {
                return max;
            } else {
                return v;
            }
        }
    }
}

export async function completionsPost(payload: CompletionsPayload) {
    try {
        const url = `${payload.aiBaseUrl}chat/completions`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${payload.aiApiKey}`,
            },
            body: JSON.stringify({
                model: payload.aiModel,
                messages: payload.messages,
                max_tokens: normalize(payload.aiMaxTokens, 1, Infinity, MAX_TOKENS),
                temperature: normalize(payload.aiTemperature, 0, Infinity, TEMPERATURE),
                top_p: normalize(payload.aiTopP, Number.EPSILON, 1, TOP_P),
            }),
        });
        const data = await response.json();
        return data.choices?.[0]?.message?.content;
    } catch (e) {
        rethrowSimple(e);
    }
}
