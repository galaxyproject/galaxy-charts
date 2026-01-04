/** Emits */
export interface EmitUpdateType {
    collapse?: boolean;
    settings?: InputValuesType;
    tab?: TabType;
    tracks?: Array<InputValuesType>;
    transcripts?: Array<TranscriptMessageType>;
}

export interface EmitSaveType {
    settings?: InputValuesType;
    tracks?: Array<InputValuesType>;
    transcripts?: Array<TranscriptMessageType>;
}

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

/** Message */
export type MessageType = "info" | "default" | "warning" | "error" | "success" | undefined;

/** Plugin */
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

/** Tabs */
export type TabType = "chat" | "settings" | "tracks";

/** Transcripts */
export type TranscriptContentType = string | { schema: string; payload: unknown };

export interface TranscriptMessageType {
    role: TranscriptRoleType;
    content: TranscriptContentType;
    variant?: TranscriptVariantType;
}

export const TRANSCRIPT_ROLE = {
    ASSISTANT: "assistant",
    SYSTEM: "system",
    USER: "user",
};

export type TranscriptRoleType = (typeof TRANSCRIPT_ROLE)[keyof typeof TRANSCRIPT_ROLE];

export const TRANSCRIPT_VARIANT_ASSISTANT = {
    // present a question to the user
    CONFIRM: "confirm",
    // encodes data not shown to user
    DATA: "data",
};

export const TRANSCRIPT_VARIANT_USER = {
    // user accepts confirmation
    ACCEPT: "accept",
    // info only shown to user
    INFO: "info",
    // user rejects confirmation
    REJECT: "reject",
    // user requests stop
    STOP: "stop",
};

export const TRANSCRIPT_VARIANT = { ...TRANSCRIPT_VARIANT_ASSISTANT, ...TRANSCRIPT_VARIANT_USER };

export type TranscriptVariantType = (typeof TRANSCRIPT_VARIANT)[keyof typeof TRANSCRIPT_VARIANT];
