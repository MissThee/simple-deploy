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
var clearTerminal_1 = __importDefault(require("../../utils/clearTerminal"));
exports.default = (function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var directly, envKeys, configFile, deploymentInfo, _i, envKeys_1, envKey, _a, envKeys_2, currentEnvKey, currentEnv, ssh, isFirstEnv, previousProjectBuildScript, _b, envKeys_3, currentEnvKey, currentEnv, _c, _d, fileMapKey, localZipFile, ssh, _e, _f, fileMapKey, fileMapValue, localZipFile, remoteZipFile, _g, _h, fileMapKey, fileMapValue, remoteZipFile, _j, _k, fileMapKey, fileMapValue, e_1;
    var _l, _m, _o, _p, _q;
    return __generator(this, function (_r) {
        switch (_r.label) {
            case 0:
                clearTerminal_1.default();
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
                _r.label = 1;
            case 1:
                _r.trys.push([1, 43, 45, 46]);
                return [4 /*yield*/, deployTool.getCorrectConfigFile(global_1.configFilePath, envKeys)];
            case 2:
                configFile = _r.sent();
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
                if (!(_r.sent()).confirm) {
                    return [2 /*return*/];
                }
                _r.label = 4;
            case 4:
                _a = 0, envKeys_2 = envKeys;
                _r.label = 5;
            case 5:
                if (!(_a < envKeys_2.length)) return [3 /*break*/, 8];
                currentEnvKey = envKeys_2[_a];
                simpleSpinner_1.default.info(chalk_1.default.blue.bold('[All Environment]'));
                currentEnv = configFile.env[currentEnvKey];
                return [4 /*yield*/, deployTool.sshCheck(currentEnv.server.serverHost, currentEnv.server.serverPort, currentEnv.server.serverUsername, configFile.local.sshPrivateKeyPath, configFile.local.sshPassphrase, currentEnv.server.serverPassword)];
            case 6:
                ssh = _r.sent();
                _r.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 5];
            case 8:
                isFirstEnv = true;
                previousProjectBuildScript = null;
                _b = 0, envKeys_3 = envKeys;
                _r.label = 9;
            case 9:
                if (!(_b < envKeys_3.length)) return [3 /*break*/, 41];
                currentEnvKey = envKeys_3[_b];
                simpleSpinner_1.default.info('Current Environment', ' ', chalk_1.default.blue.bold(currentEnvKey));
                currentEnv = configFile.env[currentEnvKey];
                if (!((_l = currentEnv.other) === null || _l === void 0 ? void 0 : _l.isClearLocalDistFileBeforeBuild)) return [3 /*break*/, 11];
                // 本地清理编译结果目录
                return [4 /*yield*/, deployTool.removeFile.apply(deployTool, __spreadArrays(['Dist'], Object.keys(currentEnv.fileMap)))];
            case 10:
                // 本地清理编译结果目录
                _r.sent();
                _r.label = 11;
            case 11:
                if (!(isFirstEnv || ((_m = currentEnv.other) === null || _m === void 0 ? void 0 : _m.needRebuildWhenBuildScriptSameWithPreviousEnv) || previousProjectBuildScript !== currentEnv.project.projectBuildScript)) return [3 /*break*/, 14];
                if (!((_o = currentEnv.project) === null || _o === void 0 ? void 0 : _o.projectBuildScript)) return [3 /*break*/, 13];
                // 本地执行打包命令
                return [4 /*yield*/, deployTool.buildCode(currentEnv.project.projectBuildScript)];
            case 12:
                // 本地执行打包命令
                _r.sent();
                _r.label = 13;
            case 13: return [3 /*break*/, 15];
            case 14:
                simpleSpinner_1.default.start('Build Code', ' ', chalk_1.default.gray('no need'), chalk_1.default.gray('(build script is same with previous running env. can use [needRebuildWhenBuildScriptSameWithPreviousEnv=true] to force build)'));
                simpleSpinner_1.default.succeed();
                _r.label = 15;
            case 15:
                _c = 0, _d = Object.keys(currentEnv.fileMap);
                _r.label = 16;
            case 16:
                if (!(_c < _d.length)) return [3 /*break*/, 20];
                fileMapKey = _d[_c];
                localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey);
                // 创建临时目录
                return [4 /*yield*/, deployTool.createDir(localZipFile)];
            case 17:
                // 创建临时目录
                _r.sent();
                return [4 /*yield*/, deployTool.buildZip(fileMapKey, localZipFile)];
            case 18:
                _r.sent();
                _r.label = 19;
            case 19:
                _c++;
                return [3 /*break*/, 16];
            case 20: return [4 /*yield*/, deployTool.sshConnect(currentEnv.server.serverHost, currentEnv.server.serverPort, currentEnv.server.serverUsername, configFile.local.sshPrivateKeyPath, configFile.local.sshPassphrase, currentEnv.server.serverPassword)];
            case 21:
                ssh = _r.sent();
                if (!((_p = currentEnv.other) === null || _p === void 0 ? void 0 : _p.isClearServerPathBeforeDeploy)) return [3 /*break*/, 23];
                // 远程清理目录
                return [4 /*yield*/, deployTool.sshRemoveFile.apply(deployTool, __spreadArrays([ssh], Object.values(currentEnv.fileMap)))];
            case 22:
                // 远程清理目录
                _r.sent();
                _r.label = 23;
            case 23:
                _e = 0, _f = Object.keys(currentEnv.fileMap);
                _r.label = 24;
            case 24:
                if (!(_e < _f.length)) return [3 /*break*/, 28];
                fileMapKey = _f[_e];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey);
                return [4 /*yield*/, deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)];
            case 25:
                remoteZipFile = _r.sent();
                return [4 /*yield*/, deployTool.sshUploadFile(ssh, localZipFile, remoteZipFile)];
            case 26:
                _r.sent();
                _r.label = 27;
            case 27:
                _e++;
                return [3 /*break*/, 24];
            case 28:
                _g = 0, _h = Object.keys(currentEnv.fileMap);
                _r.label = 29;
            case 29:
                if (!(_g < _h.length)) return [3 /*break*/, 33];
                fileMapKey = _h[_g];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                return [4 /*yield*/, deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)];
            case 30:
                remoteZipFile = _r.sent();
                return [4 /*yield*/, deployTool.sshUnzipFile(ssh, remoteZipFile)];
            case 31:
                _r.sent();
                _r.label = 32;
            case 32:
                _g++;
                return [3 /*break*/, 29];
            case 33:
                _j = 0, _k = Object.keys(currentEnv.fileMap);
                _r.label = 34;
            case 34:
                if (!(_j < _k.length)) return [3 /*break*/, 37];
                fileMapKey = _k[_j];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                return [4 /*yield*/, deployTool.sshRenameFileByFullPath(ssh, fileMapKey, fileMapValue)];
            case 35:
                _r.sent();
                _r.label = 36;
            case 36:
                _j++;
                return [3 /*break*/, 34];
            case 37:
                // 断开ssh
                deployTool.sshDisconnect(ssh);
                if (!((_q = currentEnv.other) === null || _q === void 0 ? void 0 : _q.isClearLocalDistFileAfterDeploy)) return [3 /*break*/, 39];
                // 本地清理编译后的文件
                return [4 /*yield*/, deployTool.removeFile.apply(deployTool, __spreadArrays(['Dist'], Object.keys(currentEnv.fileMap)))];
            case 38:
                // 本地清理编译后的文件
                _r.sent();
                _r.label = 39;
            case 39:
                previousProjectBuildScript = currentEnv.project.projectBuildScript;
                isFirstEnv = false;
                _r.label = 40;
            case 40:
                _b++;
                return [3 /*break*/, 9];
            case 41: 
            // 本地清理临时文件目录
            return [4 /*yield*/, deployTool.removeFile('Tmp Dir', deployTool.deployLocalTmpPath)];
            case 42:
                // 本地清理临时文件目录
                _r.sent();
                console.log(chalk_1.default.bgGreen.bold(' ' + lang_1.lang('ALL DONE') + ' '));
                return [3 /*break*/, 46];
            case 43:
                e_1 = _r.sent();
                simpleSpinner_1.default.fail();
                // 本地临时文件目录
                return [4 /*yield*/, deployTool.removeFile('Tmp Dir', deployTool.deployLocalTmpPath)];
            case 44:
                // 本地临时文件目录
                _r.sent();
                console.log(chalk_1.default.bgRed.bold(' ' + lang_1.lang('ERROR INFO') + ' '));
                console.log(e_1);
                return [3 /*break*/, 46];
            case 45: return [7 /*endfinally*/];
            case 46:
                process.exit();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map