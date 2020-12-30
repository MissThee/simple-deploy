"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSafePath = void 0;
var path_1 = __importDefault(require("path"));
var isSafePath = function (value) {
    return path_1.default.normalize(value).replace(/\\/g, '/').match(/^\/.+?\/.+?/) !== null;
};
exports.isSafePath = isSafePath;
//# sourceMappingURL=tools.js.map