import path from "path";
export const isSafePath = (value) => {
    return path.normalize(value).replace(/\\/g, '/').match(/^\/.+?\/.+?/) !== null;
};
