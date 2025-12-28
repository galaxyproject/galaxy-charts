import { rethrowSimple } from "@/utilities/simpleError";

export interface CompletionsMessage {
    role: CompletionsRole;
    content: string;
    hidden?: boolean;
    json?: any;
}

export interface CompletionsPayload {
    aiApiKey: string;
    aiBaseUrl: string;
    aiMaxTokens?: number;
    aiModel: string;
    aiTemperature?: number;
    aiTopP?: number;
    messages: CompletionsMessage[];
}

export type CompletionsRole = "user" | "assistant" | "system";

export const COMPLETIONS_KEY = "__AI_MESSAGES__";

const MAX_TOKENS = 1000;
const TEMPERATURE = 0.3;
const TOP_P = 0.8;

// Emit json tool
const EMIT_JSON = {
    type: "function",
    function: {
        name: "emit_json",
        description: "Return structured JSON payload",
        parameters: {
            type: "object",
            additionalProperties: true,
        },
    },
};

export async function completionsPost(
    payload: CompletionsPayload,
): Promise<{ content: string; json?: any } | undefined> {
    const url = `${payload.aiBaseUrl}chat/completions`;
    const payloadMessages = sanitizeMessages(payload.messages);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${payload.aiApiKey}` },
            body: JSON.stringify({
                model: payload.aiModel,
                messages: payloadMessages,
                max_tokens: normalizeParameter(payload.aiMaxTokens, 1, Infinity, MAX_TOKENS),
                temperature: normalizeParameter(payload.aiTemperature, 0, Infinity, TEMPERATURE),
                top_p: normalizeParameter(payload.aiTopP, Number.EPSILON, 1, TOP_P),
                tools: [EMIT_JSON],
                tool_choice: "auto",
            }),
        });
        const data = await response.json();
        const msg = data.choices?.[0]?.message;
        if (msg) {
            const content = msg?.content || "";
            const json = getJSON(msg?.tool_calls || []);
            return { content, json };
        }
    } catch (e) {
        rethrowSimple(e);
    }
}

function getJSON(toolCalls: Array<any>): any {
    if (toolCalls.length > 0) {
        const call = toolCalls.find((c: any) => c?.function?.name === "emit_json");
        if (call) {
            try {
                return JSON.parse(call.function.arguments || "{}");
            } catch {}
        }
    }
    return undefined;
}

function normalizeParameter(v: number | undefined, min: number, max: number, fallback: number) {
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

function sanitizeMessages(messages: CompletionsMessage[]) {
    return messages
        .filter((m) => typeof m.content === "string" && m.content.length > 0)
        .map((m) => ({ role: m.role, content: m.content }));
}
