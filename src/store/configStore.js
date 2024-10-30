import { ref } from "vue";

const root = ref("/");

export function useConfigStore() {
    function getRoot() {
        return root.value;
    }

    function setRoot(newRoot) {
        root.value = newRoot;
    }

    return {
        getRoot,
        setRoot,
    };
}
