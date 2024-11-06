import type { InputAtomicType } from "@/types";

export function toBoolean(value: InputAtomicType) {
    return String(value).toLowerCase() === "true";
}
