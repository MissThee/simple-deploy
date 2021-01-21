"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lang_1 = require("../../lang");
var chalk_1 = __importDefault(require("chalk"));
var global_1 = require("../../utils/global");
var path_1 = __importDefault(require("path"));
var simpleSpinner_1 = __importDefault(require("../../utils/simpleSpinner"));
var deployTool = __importStar(require("./deployTool"));
exports.default = (function (env) { return __awaiter(void 0, void 0, void 0, function () {
    var configFile, _i, env_1, currentEnvKey, currentEnv, _a, _b, fileMapKey, localZipFile, ssh, _c, _d, fileMapKey, fileMapValue, localZipFile, remoteZipFile, _e, _f, fileMapKey, fileMapValue, remoteZipFile, _g, _h, fileMapKey, fileMapValue, e_1;
    var _j, _k, _l;
    return __generator(this, function (_m) {
        switch (_m.label) {
            case 0:
                if (!env) {
                    console.log(chalk_1.default.bgRed.bold(' ' + lang_1.lang('ERROR INFO') + ' '));
                    console.log(lang_1.lang("Empty environment option. "), lang_1.lang("Use '-e' to specify"));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, deployTool.confirmDeploy(env)];
            case 1:
                // 部署确认
                if (!(_m.sent()).confirm) {
                    return [2 /*return*/];
                }
                _m.label = 2;
            case 2:
                _m.trys.push([2, 34, , 36]);
                return [4 /*yield*/, deployTool.getCorrectConfigFile(global_1.configFilePath, env)];
            case 3:
                configFile = _m.sent();
                if (!configFile) {
                    return [2 /*return*/];
                }
                _i = 0, env_1 = env;
                _m.label = 4;
            case 4:
                if (!(_i < env_1.length)) return [3 /*break*/, 32];
                currentEnvKey = env_1[_i];
                simpleSpinner_1.default.info('Current Environment', ' ', chalk_1.default.blue.bold(currentEnvKey));
                currentEnv = configFile.env[currentEnvKey];
                if (!((_j = currentEnv.other) === null || _j === void 0 ? void 0 : _j.isClearLocalDistFileBeforeBuild)) return [3 /*break*/, 6];
                return [4 /*yield*/, deployTool.removeFile.apply(deployTool, __spreadArrays(['Dist'], Object.keys(currentEnv.fileMap)))];
            case 5:
                _m.sent();
                _m.label = 6;
            case 6: 
            // 执行打包命令
            return [4 /*yield*/, deployTool.buildCode(currentEnv.project.projectBuildScript)
                // 执行归档命令
            ];
            case 7:
                // 执行打包命令
                _m.sent();
                _a = 0, _b = Object.keys(currentEnv.fileMap);
                _m.label = 8;
            case 8:
                if (!(_a < _b.length)) return [3 /*break*/, 12];
                fileMapKey = _b[_a];
                localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey);
                // 创建临时目录
                return [4 /*yield*/, deployTool.createDir(localZipFile)];
            case 9:
                // 创建临时目录
                _m.sent();
                return [4 /*yield*/, deployTool.buildZip(fileMapKey, localZipFile)];
            case 10:
                _m.sent();
                _m.label = 11;
            case 11:
                _a++;
                return [3 /*break*/, 8];
            case 12: return [4 /*yield*/, deployTool.sshConnect(currentEnv.server.serverHost, currentEnv.server.serverPort, currentEnv.server.serverUsername, configFile.local.sshPrivateKeyPath, configFile.local.sshPassphrase, currentEnv.server.serverPassword)
                // 清理远程目录
            ];
            case 13:
                ssh = _m.sent();
                if (!((_k = currentEnv.other) === null || _k === void 0 ? void 0 : _k.isClearServerPathBeforeDeploy)) return [3 /*break*/, 15];
                return [4 /*yield*/, deployTool.sshRemoveFile.apply(deployTool, __spreadArrays([ssh], Object.values(currentEnv.fileMap)))];
            case 14:
                _m.sent();
                _m.label = 15;
            case 15:
                _c = 0, _d = Object.keys(currentEnv.fileMap);
                _m.label = 16;
            case 16:
                if (!(_c < _d.length)) return [3 /*break*/, 20];
                fileMapKey = _d[_c];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey);
                return [4 /*yield*/, deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)];
            case 17:
                remoteZipFile = _m.sent();
                return [4 /*yield*/, deployTool.sshUploadFile(ssh, localZipFile, remoteZipFile)];
            case 18:
                _m.sent();
                _m.label = 19;
            case 19:
                _c++;
                return [3 /*break*/, 16];
            case 20:
                _e = 0, _f = Object.keys(currentEnv.fileMap);
                _m.label = 21;
            case 21:
                if (!(_e < _f.length)) return [3 /*break*/, 25];
                fileMapKey = _f[_e];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                return [4 /*yield*/, deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)];
            case 22:
                remoteZipFile = _m.sent();
                return [4 /*yield*/, deployTool.sshUnzipFile(ssh, remoteZipFile)];
            case 23:
                _m.sent();
                _m.label = 24;
            case 24:
                _e++;
                return [3 /*break*/, 21];
            case 25:
                _g = 0, _h = Object.keys(currentEnv.fileMap);
                _m.label = 26;
            case 26:
                if (!(_g < _h.length)) return [3 /*break*/, 29];
                fileMapKey = _h[_g];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                return [4 /*yield*/, deployTool.sshRenameFileByFullPath(ssh, fileMapKey, fileMapValue)];
            case 27:
                _m.sent();
                _m.label = 28;
            case 28:
                _g++;
                return [3 /*break*/, 26];
            case 29:
                //断开ssh
                deployTool.sshDisconnect(ssh);
                if (!((_l = currentEnv.other) === null || _l === void 0 ? void 0 : _l.isClearLocalDistFileAfterDeploy)) return [3 /*break*/, 31];
                return [4 /*yield*/, deployTool.removeFile.apply(deployTool, __spreadArrays(['Dist'], Object.keys(currentEnv.fileMap)))];
            case 30:
                _m.sent();
                _m.label = 31;
            case 31:
                _i++;
                return [3 /*break*/, 4];
            case 32: 
            // 清理临时文件目录
            return [4 /*yield*/, deployTool.removeFile('Tmp', deployTool.deployLocalTmpPath)];
            case 33:
                // 清理临时文件目录
                _m.sent();
                console.log(chalk_1.default.bgGreen.bold(' ' + lang_1.lang('ALL DONE') + ' '));
                return [3 /*break*/, 36];
            case 34:
                e_1 = _m.sent();
                simpleSpinner_1.default.fail();
                // 清理临时文件目录
                return [4 /*yield*/, deployTool.removeFile('Tmp', deployTool.deployLocalTmpPath)];
            case 35:
                // 清理临时文件目录
                _m.sent();
                console.log(chalk_1.default.bgRed.bold(' ' + lang_1.lang('ERROR INFO') + ' '));
                console.log(e_1);
                return [3 /*break*/, 36];
            case 36:
                process.exit();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map