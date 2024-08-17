export function getFileName(path) {
    const extension = path.replace(/^.*[\\\/]/, "");
    return extension.substring(0, extension.lastIndexOf("."));
}
