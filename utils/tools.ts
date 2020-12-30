import path from "path";

export const isSafePath = (value: string) => {
    return path.normalize(value).replace(/\\/g, '/').match(/^\/.+?\/.+?/) !== null
}
