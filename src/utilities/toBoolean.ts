import { type InputValueType } from "@/types";

export function toBoolean(value: InputValueType) {
    return String(value).toLowerCase() === "true";
}
