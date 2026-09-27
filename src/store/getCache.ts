const entries = new Map<string, Promise<unknown>>();

/** Produces once per key; a rejected entry is dropped. */
export function getCache<T>(key: string, produce: () => Promise<T>): Promise<T> {
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

export function resetCache(): void {
    entries.clear();
}
