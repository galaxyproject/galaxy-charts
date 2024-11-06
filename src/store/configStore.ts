import { ref, type Ref } from "vue";

const root = ref("/");
const credentials: Ref<RequestCredentials> = ref("include");

export function useConfigStore() {
    function getCredentials(): RequestCredentials {
        return credentials.value;
    }

    function setCredentials(newCredentials: RequestCredentials) {
        credentials.value = newCredentials;
    }

    function getRoot(): string {
        return root.value;
    }

    function setRoot(newRoot: string) {
        root.value = newRoot;
    }

    return {
        getCredentials,
        setCredentials,
        getRoot,
        setRoot,
    };
}
