import { ref } from "vue";

const apiKey = ref("");
const root = ref("/");

export function useConfigStore() {

    function getApiKey() {
        return apiKey.value;
    }

    function getRoot() {
        return root.value;
    }

    function setApiKey(newRoot) {
        root.value = newRoot;
    }

    function setRoot(newRoot) {
        root.value = newRoot;
    }

    return {
        getApiKey,
        getRoot,
        setApiKey,
        setRoot,
    };
}
