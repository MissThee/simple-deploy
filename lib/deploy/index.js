"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
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
var processWatcher_1 = __importDefault(require("../init/processWatcher"));
exports.default = (function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var directly, verbose, envKeys, configFile, deploymentInfo, _i, envKeys_1, envKey, _a, envKeys_2, currentEnvKey, currentEnv, isFirstEnv, previousProjectBuildScript, _b, envKeys_3, currentEnvKey, currentEnv, verboseFinal, _c, _d, fileMapKey, localZipFile, ssh, _e, _f, fileMapKey, fileMapValue, localZipFile, remoteZipFile, _g, _h, fileMapKey, fileMapValue, remoteZipFile, _j, _k, fileMapKey, fileMapValue, e_1;
    var _l, _m, _o, _p, _q, _r, _s, _t, _u;
    return __generator(this, function (_v) {
        switch (_v.label) {
            case 0:
                directly = opts.directly // true-跳过确认
                ;
                verbose = opts.verbose // true-详细模式（全局设置），会被配置文件中的配置覆盖
                ;
                envKeys = opts.environment;
                (0, processWatcher_1.default)(function () {
                    // 进程退出前清理临时文件目录
                    deployTool.removeFileSync('Tmp Dir', deployTool.deployLocalTmpPath);
                });
                if (!envKeys) {
                    console.log(chalk_1.default.bgRed.bold(' ' + (0, lang_1.lang)('ERROR INFO') + ' '));
                    console.log((0, lang_1.lang)("Empty environment option. "), (0, lang_1.lang)("Use '-e' to specify"));
                    return [2 /*return*/];
                }
                _v.label = 1;
            case 1:
                _v.trys.push([1, 43, 45, 46]);
                return [4 /*yield*/, deployTool.getCorrectConfigFile(global_1.configFilePath, envKeys)];
            case 2:
                configFile = _v.sent();
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
                if (!(_v.sent()).confirm) {
                    return [2 /*return*/];
                }
                _v.label = 4;
            case 4:
                simpleSpinner_1.default.info(chalk_1.default.blue.bold('All Environment'));
                _a = 0, envKeys_2 = envKeys;
                _v.label = 5;
            case 5:
                if (!(_a < envKeys_2.length)) return [3 /*break*/, 8];
                currentEnvKey = envKeys_2[_a];
                currentEnv = configFile.env[currentEnvKey];
                // 测试连接ssh
                return [4 /*yield*/, deployTool.sshCheck(currentEnv.server.serverHost, currentEnv.server.serverPort, currentEnv.server.serverUsername, configFile.local.sshPrivateKeyPath, configFile.local.sshPassphrase, currentEnv.server.serverPassword)];
            case 6:
                // 测试连接ssh
                _v.sent();
                _v.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 5];
            case 8:
                isFirstEnv = true;
                previousProjectBuildScript = null;
                _b = 0, envKeys_3 = envKeys;
                _v.label = 9;
            case 9:
                if (!(_b < envKeys_3.length)) return [3 /*break*/, 41];
                currentEnvKey = envKeys_3[_b];
                simpleSpinner_1.default.info(chalk_1.default.blue('Current Environment'), ' ', chalk_1.default.magenta(currentEnvKey));
                currentEnv = configFile.env[currentEnvKey];
                if (!((_l = currentEnv.other) === null || _l === void 0 ? void 0 : _l.isClearLocalDistFileBeforeBuild)) return [3 /*break*/, 11];
                // 本地清理编译结果目录
                return [4 /*yield*/, deployTool.removeFile.apply(deployTool, __spreadArray(['Dist'], Object.keys(currentEnv.fileMap), false))];
            case 10:
                // 本地清理编译结果目录
                _v.sent();
                _v.label = 11;
            case 11:
                if (!(isFirstEnv || ((_m = currentEnv.other) === null || _m === void 0 ? void 0 : _m.needRebuildWhenBuildScriptSameWithPreviousEnv) || previousProjectBuildScript !== currentEnv.project.projectBuildScript)) return [3 /*break*/, 19];
                if (!((_o = currentEnv.project) === null || _o === void 0 ? void 0 : _o.projectBuildScript)) return [3 /*break*/, 13];
                verboseFinal = undefined;
                if (((_q = (_p = configFile.env[currentEnvKey]) === null || _p === void 0 ? void 0 : _p.other) === null || _q === void 0 ? void 0 : _q.verbose) !== undefined) {
                    verboseFinal = (_s = (_r = configFile.env[currentEnvKey]) === null || _r === void 0 ? void 0 : _r.other) === null || _s === void 0 ? void 0 : _s.verbose;
                }
                else {
                    verboseFinal = verbose;
                }
                return [4 /*yield*/, deployTool.buildCode(currentEnv.project.projectBuildScript, verboseFinal)];
            case 12:
                _v.sent();
                _v.label = 13;
            case 13:
                _c = 0, _d = Object.keys(currentEnv.fileMap);
                _v.label = 14;
            case 14:
                if (!(_c < _d.length)) return [3 /*break*/, 18];
                fileMapKey = _d[_c];
                localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey);
                // 创建临时目录
                return [4 /*yield*/, deployTool.createDir(localZipFile)];
            case 15:
                // 创建临时目录
                _v.sent();
                return [4 /*yield*/, deployTool.buildZip(fileMapKey, localZipFile)];
            case 16:
                _v.sent();
                _v.label = 17;
            case 17:
                _c++;
                return [3 /*break*/, 14];
            case 18: return [3 /*break*/, 20];
            case 19:
                simpleSpinner_1.default.start('Build Code And Archive', ' ', chalk_1.default.gray('no need'), chalk_1.default.gray('(build script is same with previous env. can use [needRebuildWhenBuildScriptSameWithPreviousEnv=true] to force build)'));
                simpleSpinner_1.default.succeed();
                _v.label = 20;
            case 20: return [4 /*yield*/, deployTool.sshConnect(currentEnv.server.serverHost, currentEnv.server.serverPort, currentEnv.server.serverUsername, configFile.local.sshPrivateKeyPath, configFile.local.sshPassphrase, currentEnv.server.serverPassword)];
            case 21:
                ssh = _v.sent();
                if (!((_t = currentEnv.other) === null || _t === void 0 ? void 0 : _t.isClearServerPathBeforeDeploy)) return [3 /*break*/, 23];
                // 远程清理目录
                return [4 /*yield*/, deployTool.sshRemoveFile.apply(deployTool, __spreadArray([ssh], Object.values(currentEnv.fileMap), false))];
            case 22:
                // 远程清理目录
                _v.sent();
                _v.label = 23;
            case 23:
                _e = 0, _f = Object.keys(currentEnv.fileMap);
                _v.label = 24;
            case 24:
                if (!(_e < _f.length)) return [3 /*break*/, 28];
                fileMapKey = _f[_e];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey);
                return [4 /*yield*/, deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)];
            case 25:
                remoteZipFile = _v.sent();
                return [4 /*yield*/, deployTool.sshUploadFile(ssh, localZipFile, remoteZipFile)];
            case 26:
                _v.sent();
                _v.label = 27;
            case 27:
                _e++;
                return [3 /*break*/, 24];
            case 28:
                _g = 0, _h = Object.keys(currentEnv.fileMap);
                _v.label = 29;
            case 29:
                if (!(_g < _h.length)) return [3 /*break*/, 33];
                fileMapKey = _h[_g];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                return [4 /*yield*/, deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)];
            case 30:
                remoteZipFile = _v.sent();
                return [4 /*yield*/, deployTool.sshUnzipFile(ssh, remoteZipFile)];
            case 31:
                _v.sent();
                _v.label = 32;
            case 32:
                _g++;
                return [3 /*break*/, 29];
            case 33:
                _j = 0, _k = Object.keys(currentEnv.fileMap);
                _v.label = 34;
            case 34:
                if (!(_j < _k.length)) return [3 /*break*/, 37];
                fileMapKey = _k[_j];
                fileMapValue = path_1.default.normalize(currentEnv.fileMap[fileMapKey]);
                return [4 /*yield*/, deployTool.sshRenameFileByFullPath(ssh, fileMapKey, fileMapValue)];
            case 35:
                _v.sent();
                _v.label = 36;
            case 36:
                _j++;
                return [3 /*break*/, 34];
            case 37:
                // 断开ssh
                deployTool.sshDisconnect(ssh);
                if (!((_u = currentEnv.other) === null || _u === void 0 ? void 0 : _u.isClearLocalDistFileAfterDeploy)) return [3 /*break*/, 39];
                // 本地清理编译后的文件
                return [4 /*yield*/, deployTool.removeFile.apply(deployTool, __spreadArray(['Dist'], Object.keys(currentEnv.fileMap), false))];
            case 38:
                // 本地清理编译后的文件
                _v.sent();
                _v.label = 39;
            case 39:
                previousProjectBuildScript = currentEnv.project.projectBuildScript;
                isFirstEnv = false;
                _v.label = 40;
            case 40:
                _b++;
                return [3 /*break*/, 9];
            case 41: 
            // 本地清理临时文件目录
            return [4 /*yield*/, deployTool.removeFile('Tmp Dir', deployTool.deployLocalTmpPath)];
            case 42:
                // 本地清理临时文件目录
                _v.sent();
                console.log(chalk_1.default.bgGreen.bold(' ' + (0, lang_1.lang)('ALL DONE') + ' '));
                return [3 /*break*/, 46];
            case 43:
                e_1 = _v.sent();
                simpleSpinner_1.default.fail();
                // 本地临时文件目录
                return [4 /*yield*/, deployTool.removeFile('Tmp Dir', deployTool.deployLocalTmpPath)];
            case 44:
                // 本地临时文件目录
                _v.sent();
                console.log(chalk_1.default.bgRed.bold(' ' + (0, lang_1.lang)('ERROR INFO') + ' '));
                console.log(e_1);
                return [3 /*break*/, 46];
            case 45: return [7 /*endfinally*/];
            case 46: return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map