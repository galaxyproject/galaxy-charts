export interface InputElementType {
    name: string;
    label?: string;
    help?: string;
    type: string;
    min?: string;
    max?: string;
    rows?: string;
    extension?: string;
    optional?: string;
    is_auto?: string;
    is_text?: string;
    is_number?: string;
    data?: Array<{ label: string; value: string }>;
    value?: string;
    test_param?: {
        name: string;
        type: string;
        data?: Array<{ label: string; value: string }>;
        value?: string;
    };
    cases?: Array<{
        value: string;
        inputs: Array<InputElementType>;
    }>;
}

export type InputAtomicType = boolean | string | number | null | undefined;

export type InputValuesType = Record<string, any>;

export type MessageType = "info" | "default" | "warning" | "error" | "success" | undefined;

export interface PluginConfigType {
    credentials?: RequestCredentials;
    dataset_id?: string;
    dataset_url?: string;
    settings?: InputValuesType;
    tracks?: Array<InputValuesType>;
    chart_dict?: {
        groups?: any;
        settings?: any;
    };
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
