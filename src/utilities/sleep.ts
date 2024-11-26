const WAITTIME = 2000;

/** Wait helper */
export function sleep(wt = WAITTIME) {
    return new Promise((resolve) => setTimeout(resolve, wt));
}
