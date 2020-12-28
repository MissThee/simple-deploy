"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configFilePath = exports.configFileFullName = void 0;
var path_1 = __importDefault(require("path"));
exports.configFileFullName = 'deploy.config.json';
exports.configFilePath = path_1.default.join(process.cwd(), exports.configFileFullName);
//# sourceMappingURL=param.js.map