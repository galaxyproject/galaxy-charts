import axios from "axios";
import { rethrowSimple } from "@/utilities/simpleError";
export async function versionGet(root) {
    try {
        const { data } = await axios.get(`${root}api/version`);
        return data.version_major;
    } catch (err) {
        rethrowSimple(err);
    }
}
