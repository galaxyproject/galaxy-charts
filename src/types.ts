export type InputAtomicType = boolean | string | number | null | undefined;

export interface InputElementType {
    cases?: Array<{
        value: string;
        inputs: Array<InputElementType>;
    }>;
    data?: Array<{ label: string; value: string }>;
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

export type InputSelectOptionType = {
    disabled?: boolean;
    label: string;
    value: InputSelectValueType | null;
    type?: string;
};

export type InputSelectValueType = {
    id: string;
    [key: string]: string | number | boolean | Array<string> | Record<string, InputSelectValueType>;
};

export type InputValuesType = Record<string, any>;

export type MessageType = "info" | "default" | "warning" | "error" | "success" | undefined;

export interface PluginConfigType {
    credentials?: RequestCredentials;
    dataset_id?: string;
    dataset_url?: string;
    settings?: InputValuesType;
    tracks?: Array<InputValuesType>;
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

export type RequestOptionsType = Record<string, any>;

export type ResponseType = Promise<{ data: any; response: Response }>;
