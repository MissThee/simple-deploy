"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configFilePath = exports.configFileExt = exports.configFileName = void 0;
var path_1 = __importDefault(require("path"));
exports.configFileName = 'simple-deploy.config';
var configFileExt;
(function (configFileExt) {
    configFileExt["JSON"] = ".json";
    configFileExt["JS"] = ".js";
})(configFileExt = exports.configFileExt || (exports.configFileExt = {}));
exports.configFilePath = path_1.default.join(process.cwd(), exports.configFileName);
//# sourceMappingURL=global.js.map