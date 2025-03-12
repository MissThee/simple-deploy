import path from 'path';
export const configFileName = 'simple-deploy.config';
export var configFileExt;
(function (configFileExt) {
    configFileExt["JSON"] = ".json";
    configFileExt["JS"] = ".js";
    configFileExt["CJS"] = ".cjs";
    configFileExt["MJS"] = ".mjs";
})(configFileExt || (configFileExt = {}));
export const configFilePath = path.join(process.cwd(), configFileName);
