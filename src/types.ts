/** Inputs */

export type InputAtomicType = boolean | string | number | null | undefined;

export interface InputElementType {
    cases?: Array<{
        value: string;
        inputs: Array<InputElementType>;
    }>;
    data?: Array<{ label: string; value: string }>;
    deferred?: boolean;
    extension?: string;
    filterable?: boolean;
    help?: string;
    is_auto?: string;
    is_text?: string;
    is_number?: string;
    label?: string;
    max?: string;
    min?: string;
    name: string;
    optional?: string;
    rows?: string;
    tables?: Array<string>;
    test_param?: {
        name: string;
        type: string;
        data?: Array<{ label: string; value: string }>;
        value?: string;
    };
    type: string;
    url: string;
    value?: string;
}

export type InputOptionType = {
    disabled?: boolean;
    label: string;
    value: InputValuesType | null;
    type?: string;
};

export type InputValuesType = {
    [key: string]: any;
};

/** Plugin */

export type MessageType = "info" | "default" | "warning" | "error" | "success" | undefined;

export interface PluginConfigType {
    credentials?: RequestCredentials;
    dataset_id?: string;
    dataset_url?: string;
    settings?: InputValuesType;
    tracks?: Array<InputValuesType>;
    transcripts?: Array<TranscriptMessageType>;
}

export interface PluginIncomingType {
    root?: string;
    visualization_config?: PluginConfigType;
    visualization_id?: string;
    visualization_plugin?: PluginType;
    visualization_title?: string;
}

export interface PluginType {
    name?: string;
    html?: string | null;
    logo?: string | null;
    description?: string | null;
    specs?: Record<string, string>;
    settings?: Array<InputElementType>;
    tracks?: Array<InputElementType>;
}

/** Requests */

export type RequestOptionsType = Record<string, any>;

export type ResponseType = Promise<{ data: any; response: Response }>;

/** Transcripts */

export interface TranscriptMessageType {
    role: TranscriptRoleType;
    content: string;
    variant?: TranscriptVariantType;
}

export type TranscriptRoleType = "assistant" | "system" | "user";

export type TranscriptVariantChatType = "accept" | "confirm" | "reject" | "stop";

export type TranscriptVariantType = TranscriptVariantChatType | (string & {});
