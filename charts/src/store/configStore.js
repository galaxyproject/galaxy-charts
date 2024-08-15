import { ref } from "vue";
import { defineStore } from "pinia";

export const useConfigStore = defineStore("config", () => {
    const apiKey = ref("");
    const root = ref("/");

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
});
