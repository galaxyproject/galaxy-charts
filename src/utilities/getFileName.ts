export function getFileName(path: string) {
    const extension = path.replace(/^.*[\\\/]/, "");
    return extension.substring(0, extension.lastIndexOf("."));
}
