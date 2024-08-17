const slashCleanupRegEx = /(\/)+/g;
export function slashCleanup(path: string) {
    return path.replace(slashCleanupRegEx, "/");
}