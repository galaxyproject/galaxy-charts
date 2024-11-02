import { ref } from "vue";

const root = ref("/");
const credentials = ref("include");

export function useConfigStore() {
    function getCredentials() {
        return credentials.value;
    }

    function setCredentials(newCredentials) {
        credentials.value = newCredentials;
    }

    function getRoot() {
        return root.value;
    }

    function setRoot(newRoot) {
        root.value = newRoot;
    }

    return {
        getCredentials,
        setCredentials,
        getRoot,
        setRoot,
    };
}
