/** What each client has fetched, held as long as the client is. A caller decides how long its
 * lookups stay fresh by the client it passes, and two clients never see each other's answers. */
let caches = new WeakMap<object, Map<string, Promise<unknown>>>();

/** Produces once per client and key; a rejected entry is dropped. */
export function getCache<T>(owner: object, key: string, produce: () => Promise<T>): Promise<T> {
    let entries = caches.get(owner);
    if (!entries) {
        entries = new Map();
        caches.set(owner, entries);
    }
    let entry = entries.get(key) as Promise<T> | undefined;
    if (!entry) {
        entry = produce().catch((err) => {
            entries.delete(key);
            throw err;
        });
        entries.set(key, entry);
    }
    return entry;
}

/** Forgets every client's entries; for tests that share one client across cases. */
export function resetCache(): void {
    caches = new WeakMap();
}
