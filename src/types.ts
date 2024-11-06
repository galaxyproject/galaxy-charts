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
    test_param?: {
        name: string;
        type: string;
        data?: Array<{ label: string; value: string }>;
    };
    cases?: Array<{
        value: string;
        inputs: Array<InputElementType>;
    }>;
}

export type InputValueType = boolean | string | number | null | undefined;

export type MessageType = "info" | "default" | "warning" | "error" | "success" | undefined;
