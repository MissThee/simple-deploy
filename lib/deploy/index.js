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
exports.default = (function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var directly, envKeys, configFile, deploymentInfo, _i, envKeys_1, envKey, _a, envKeys_2, currentEnvKey, currentEnv, _b, _c, fileMapKey, localZipFile, ssh, _d, _e, fileMapKey, fileMapValue, localZipFile, remoteZipFile, _f, _g, fileMapKey, fileMapValue, remoteZipFile, _h, _j, fileMapKey, fileMapValue, e_1;
    var _k, _l, _m, _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0:
                directly = opts.directly;
                envKeys = opts.environment;
                deployTool.clearUp(function () {
                    // 进程退出前清理临时文件目录
                    deployTool.removeFileSync('Tmp Dir', deployTool.deployLocalTmpPath);
                });
                if (!envKeys) {
                    console.log(chalk_1.default.bgRed.bold(' ' + lang_1.lang('ERROR INFO') + ' '));
                    console.log(lang_1.lang("Empty environment option. "), lang_1.lang("Use '-e' to specify"));
                    return [2 /*return*/];
                }
                _p.label = 1;
            case 1:
                _p.trys.push([1, 36, 38, 39]);
                return [4 /*yield*/, deployTool.getCorrectConfigFile(global_1.configFilePath, envKeys)];
            case 2:
                configFile = _p.sent();
                if (!configFile) {
                    return [2 /*return*/];
                }
                deploymentInfo = '';
                deploymentInfo += '\n' + '· ' + chalk_1.default.blue(configFile.local.projectName);
                for (_i = 0, envKeys_1 = envKeys; _i < envKeys_1.length; _i++) {
                    envKey = envKeys_1[_i];
                    deploymentInfo += '\n' + '· ' + chalk_1.default.magenta(envKey) + chalk_1.default.yellow(': ') + chalk_1.default.green(configFile.env[envKey].server.serverHost);
                }
                if (!!directly) return [3 /*break*/, 4];
                return [4 /*yield*/, deployTool.confirmDeploy(deploymentInfo, envKeys)];
            case 3:
                if (!(_p.sent()).confirm) {
                    return [2 /*return*/];
                }
                _p.label = 4;
            case 4:
                _a = 0, envKeys_2 = envKeys;
                _p.label = 5;
            case 5:
                if (!(_a < envKeys_2.length)) return [3 /*break*/, 34];
                currentEnvKey = envKeys_2[_a];
                simpleSpinner_1.default.info('Current Environment', ' ', chalk_1.default.blue.bold(currentEnvKey));
                currentEnv = configFile.env[currentEnvKey];
                if (!((_k = currentEnv.other) === null || _k === void 0 ? void 0 : _k.isClearLocalDistFileBeforeBuild)) return [3 /*break*/, 7];
                return [4 /*yield*/, deployTool.removeFile.apply(deployTool, __spreadArrays(['Dist'], Object.keys(currentEnv.fileMap)))];
            case 6:
                _p.sent();
                _p.label = 7;
            case 7:
                if (!((_l = currentEnv.project) === null || _l === void 0 ? void 0 : _l.projectBuildScript)) return [3 /*break*/, 9];
                return [4 /*yield*/, deployTool.buildCode(currentEnv.project.projectBuildScript)];
            case 8:
                _p.sent();
                _p.label = 9;
            case 9:
                _b = 0, _c = Object.keys(currentEnv.fileMap);
                _p.label = 10;
            case 10:
                if (!(_b < _c.length)) return [3 /*break*/, 14];
                fileMapKey = _c[_b];
                localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey);
                // 创建临时目录
                return [4 /*yield*/, deployTool.createDir(localZipFile)];
            case 11:
                // 创建临时目录
                _p.sent();
                return [4 /*yield*/, deployTool.buildZip(fileMapKey, localZipFile)];
            case 12:
                _p.sent();
                _p.label = 13;
            case 13:
                _b++;
                return [3 /*break*/, 10];
            case 14: return [4 /*yield*/, deployTool.sshConnect(currentEnv.server.serverHost, currentEnv.server.serverPort, currentEnv.server.serverUsername, configFile.local.sshPrivateKeyPath, configFile.local.sshPassphrase, currentEnv.server.serverPassword)
                // 清理远程目录
            ];
            case 15:
                ssh = _p.sent();
                if (!((_m = currentEnv.other) === null || _m === void 0 ? void 0 : _m.isClearServerPathBeforeDeploy)) return [3 /*break*/, 17];
                return [4 /*yield*/, deployTool.sshRemoveFile.apply(deployTool, __spreadArrays([ssh], Object.values(currentEnv.fileMap)))];
            case 16:
                _p.sent();
                _p.label = 17;
            case 17:
                _d = 0, _e = Object.keys(currentEnv.fileMap);
                _p.label = 18;
            case 18:
                if (!(_d < _e.length)) return [3 /*break*/, 22];
                fileMapKey = _e[_d];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey);
                return [4 /*yield*/, deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)];
            case 19:
                remoteZipFile = _p.sent();
                return [4 /*yield*/, deployTool.sshUploadFile(ssh, localZipFile, remoteZipFile)];
            case 20:
                _p.sent();
                _p.label = 21;
            case 21:
                _d++;
                return [3 /*break*/, 18];
            case 22:
                _f = 0, _g = Object.keys(currentEnv.fileMap);
                _p.label = 23;
            case 23:
                if (!(_f < _g.length)) return [3 /*break*/, 27];
                fileMapKey = _g[_f];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                return [4 /*yield*/, deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)];
            case 24:
                remoteZipFile = _p.sent();
                return [4 /*yield*/, deployTool.sshUnzipFile(ssh, remoteZipFile)];
            case 25:
                _p.sent();
                _p.label = 26;
            case 26:
                _f++;
                return [3 /*break*/, 23];
            case 27:
                _h = 0, _j = Object.keys(currentEnv.fileMap);
                _p.label = 28;
            case 28:
                if (!(_h < _j.length)) return [3 /*break*/, 31];
                fileMapKey = _j[_h];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                return [4 /*yield*/, deployTool.sshRenameFileByFullPath(ssh, fileMapKey, fileMapValue)];
            case 29:
                _p.sent();
                _p.label = 30;
            case 30:
                _h++;
                return [3 /*break*/, 28];
            case 31:
                //断开ssh
                deployTool.sshDisconnect(ssh);
                if (!((_o = currentEnv.other) === null || _o === void 0 ? void 0 : _o.isClearLocalDistFileAfterDeploy)) return [3 /*break*/, 33];
                return [4 /*yield*/, deployTool.removeFile.apply(deployTool, __spreadArrays(['Dist'], Object.keys(currentEnv.fileMap)))];
            case 32:
                _p.sent();
                _p.label = 33;
            case 33:
                _a++;
                return [3 /*break*/, 5];
            case 34: 
            // 清理临时文件目录
            return [4 /*yield*/, deployTool.removeFile('Tmp Dir', deployTool.deployLocalTmpPath)];
            case 35:
                // 清理临时文件目录
                _p.sent();
                console.log(chalk_1.default.bgGreen.bold(' ' + lang_1.lang('ALL DONE') + ' '));
                return [3 /*break*/, 39];
            case 36:
                e_1 = _p.sent();
                simpleSpinner_1.default.fail();
                // 清理临时文件目录
                return [4 /*yield*/, deployTool.removeFile('Tmp Dir', deployTool.deployLocalTmpPath)];
            case 37:
                // 清理临时文件目录
                _p.sent();
                console.log(chalk_1.default.bgRed.bold(' ' + lang_1.lang('ERROR INFO') + ' '));
                console.log(e_1);
                return [3 /*break*/, 39];
            case 38: return [7 /*endfinally*/];
            case 39:
                process.exit();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map