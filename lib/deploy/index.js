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
var lang_1 = __importDefault(require("../../lang"));
var chalk_1 = __importDefault(require("chalk"));
var global_1 = require("../../utils/global");
var node_ssh_1 = require("node-ssh");
var path_1 = __importDefault(require("path"));
var fs_1 = __importStar(require("fs"));
var inquirer_1 = __importDefault(require("inquirer"));
var child_process_1 = __importDefault(require("child_process"));
var archiver_1 = __importDefault(require("archiver"));
var os_1 = __importDefault(require("os"));
var SimpleSpinner_1 = __importDefault(require("./SimpleSpinner"));
var tools_1 = require("../../utils/tools");
var maxBuffer = 5000 * 1024;
var currentTimestamp = '_' + Date.now();
var deployLocalTmpPath = '.deployTmp' + currentTimestamp;
var zipFileIndex = 0;
var ss = new SimpleSpinner_1.default();
// 是否确认部署
var confirmDeployTask = function (param) {
    return inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: lang_1.default('sure to deploy') + ' ' + chalk_1.default.magenta(param.join(',')) + ' ?',
        }
    ]);
};
// 检查配置文件
var getCorrectConfigFileTask = function (configFilePath, envKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var configFile, errorParamArr, isOk, _i, envKeys_1, envKey, envNode, projectNode, serverNode, fileMapNode, _a, _b, key;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                ss.start('Check Configuration', ' ', chalk_1.default.magenta(configFilePath));
                //检查配置文件存在
                return [4 /*yield*/, fs_1.promises.access(configFilePath, fs_1.default.constants.F_OK)
                    // 获取配置文件
                ];
            case 1:
                //检查配置文件存在
                _c.sent();
                configFile = require(configFilePath);
                errorParamArr = [];
                isOk = true;
                for (_i = 0, envKeys_1 = envKeys; _i < envKeys_1.length; _i++) {
                    envKey = envKeys_1[_i];
                    if (envKey in configFile.env) {
                        envNode = configFile.env[envKey];
                        projectNode = envNode.project;
                        if (!(projectNode === null || projectNode === void 0 ? void 0 : projectNode.projectBuildScript)) {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'project.projectBuildScript',
                                reason: lang_1.default('not found or empty value')
                            });
                            isOk = false;
                        }
                        serverNode = envNode.server;
                        if (!(serverNode === null || serverNode === void 0 ? void 0 : serverNode.serverHost)) {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'server.serverHost',
                                reason: lang_1.default('not found or empty value')
                            });
                            isOk = false;
                        }
                        if (Object.prototype.toString.call(serverNode === null || serverNode === void 0 ? void 0 : serverNode.serverPort) !== '[object Number]') {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'server.serverPort',
                                reason: lang_1.default('not found or NaN')
                            });
                            isOk = false;
                        }
                        if (!(serverNode === null || serverNode === void 0 ? void 0 : serverNode.serverUsername)) {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'server.serverUsername',
                                reason: lang_1.default('not found or empty value')
                            });
                            isOk = false;
                        }
                        fileMapNode = envNode.fileMap;
                        if (!fileMapNode) {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'fileMap',
                                reason: lang_1.default('not found or empty value')
                            });
                            isOk = false;
                        }
                        else {
                            for (_a = 0, _b = Object.keys(fileMapNode); _a < _b.length; _a++) {
                                key = _b[_a];
                                if (!key) {
                                    errorParamArr.push({
                                        param: 'env.' + envKey + 'fileMap',
                                        reason: lang_1.default('empty key')
                                    });
                                    isOk = false;
                                    continue;
                                }
                                if (path_1.default.normalize(fileMapNode[key]).replace(/\\/g, '/').match(/^\/.+?\/.+?/) === null) {
                                    errorParamArr.push({
                                        param: 'env.' + envKey + 'fileMap.' + key,
                                        reason: lang_1.default('Absolute path') + '. ' + lang_1.default('At least two levels of directory')
                                    });
                                    isOk = false;
                                }
                            }
                        }
                    }
                    else {
                        errorParamArr.push({
                            param: envKey,
                            reason: lang_1.default('unknown env')
                        });
                        isOk = false;
                    }
                }
                if (!isOk) {
                    throw errorParamArr.map(function (item) { return lang_1.default('Error Param') + ' ' + chalk_1.default.magenta(item.param) + ' ' + chalk_1.default.red(item.reason); }).join('\r\n');
                }
                ss.succeed();
                return [2 /*return*/, configFile];
        }
    });
}); };
// 执行打包脚本
var buildCodeTask = function (script) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('Build Code', ' ', chalk_1.default.magenta(script));
                if (script.length === 0) {
                    ss.succeed();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        child_process_1.default.exec(script, {
                            cwd: process.cwd(),
                            maxBuffer: maxBuffer
                        }, function (error, stdout, stderr) {
                            if (error) {
                                reject(error);
                            }
                            else {
                                ss.succeed();
                                resolve();
                            }
                        });
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 使用fileMap的key生成本地zip文件全名
var getFilePathByProjectPath = function (projectPath) {
    return path_1.default.join(process.cwd(), deployLocalTmpPath, zipFileIndex++ + '_' + path_1.default.basename(projectPath) + '.zip');
};
var mkdirsSync = function (dirname) {
    if (dirname === '' || fs_1.default.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdirsSync(path_1.default.dirname(dirname))) {
            fs_1.default.mkdirSync(dirname);
            return true;
        }
    }
};
// 创建临时存储目录
var createFolderTask = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mkdirsSync(filePath.substring(0, filePath.lastIndexOf(path_1.default.basename(filePath))))];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
// 归档Zip
var buildZipTask = function (sourcePath, outputFile) { return __awaiter(void 0, void 0, void 0, function () {
    var archive, sourcePathStat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sourcePath = path_1.default.join(process.cwd(), sourcePath);
                ss.start('Zip Local File', ' ', chalk_1.default.magenta(sourcePath));
                archive = archiver_1.default('zip', { zlib: { level: 9 } });
                return [4 /*yield*/, fs_1.promises.stat(sourcePath)];
            case 1:
                sourcePathStat = _a.sent();
                if (sourcePathStat.isFile()) {
                    archive.file(sourcePath, { name: path_1.default.basename(sourcePath) });
                }
                else if (sourcePathStat.isDirectory()) {
                    archive.directory(sourcePath, false);
                }
                else {
                    throw lang_1.default('unknown file type') + ': ' + sourcePath;
                }
                archive.pipe(fs_1.default.createWriteStream(outputFile));
                return [4 /*yield*/, archive.finalize()];
            case 2:
                _a.sent();
                ss.succeedAppend(" ", chalk_1.default.yellow(lang_1.default('to')), ' ', chalk_1.default.magenta(path_1.default.normalize(outputFile)));
                return [2 /*return*/, outputFile];
        }
    });
}); };
// 删除本地打包文件
var removeFileTask = function (localPath) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                localPath = path_1.default.join(process.cwd(), localPath);
                ss.start('Clean Local Tmp', ' ', chalk_1.default.magenta(localPath));
                return [4 /*yield*/, fs_1.promises.rm(localPath, { recursive: true, force: true })];
            case 1:
                _a.sent();
                ss.succeed();
                return [2 /*return*/];
        }
    });
}); };
// 连接ssh
var sshConnectTask = function (host, port, username, privateKey, passphrase, password) { return __awaiter(void 0, void 0, void 0, function () {
    var sshConfig, answers, ssh;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('SSH Connect', ' ', chalk_1.default.magenta(host));
                if (privateKey && privateKey.trimStart().startsWith('~')) {
                    privateKey = path_1.default.join(os_1.default.homedir(), privateKey.substring(privateKey.indexOf('~') + 1));
                }
                sshConfig = {
                    host: host,
                    port: port,
                    username: username,
                    password: password,
                    privateKey: privateKey,
                    passphrase: passphrase,
                    tryKeyboard: true,
                };
                if (!(!privateKey && !password)) return [3 /*break*/, 2];
                return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            type: 'password',
                            name: 'password',
                            message: lang_1.default('please input password')
                        }
                    ])];
            case 1:
                answers = _a.sent();
                sshConfig.password = answers.password;
                _a.label = 2;
            case 2:
                !password && delete sshConfig.password;
                !privateKey && delete sshConfig.privateKey;
                !passphrase && delete sshConfig.passphrase;
                ssh = new node_ssh_1.NodeSSH();
                return [4 /*yield*/, ssh.connect(sshConfig)];
            case 3:
                _a.sent();
                ss.succeed();
                return [2 /*return*/, ssh];
        }
    });
}); };
// 上传文件
var sshUploadFileTask = function (ssh, localZipFile, remoteFile) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('Upload File', ' ', chalk_1.default.magenta(localZipFile));
                return [4 /*yield*/, ssh.putFile(path_1.default.normalize(localZipFile), path_1.default.normalize(remoteFile), null, {
                        concurrency: 1
                    })];
            case 1:
                _a.sent();
                ss.succeedAppend(" ", chalk_1.default.yellow(lang_1.default('to')), ' ', chalk_1.default.magenta(path_1.default.normalize(remoteFile)));
                return [2 /*return*/, remoteFile];
        }
    });
}); };
// 删除远程文件
var sshRemoveFileTask = function (ssh) {
    var remotePaths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        remotePaths[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, remotePaths_1, remotePath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    ss.start('Clean Remote File Or Path');
                    _a = 0, remotePaths_1 = remotePaths;
                    _b.label = 1;
                case 1:
                    if (!(_a < remotePaths_1.length)) return [3 /*break*/, 4];
                    remotePath = remotePaths_1[_a];
                    if (!tools_1.isSafePath(remotePath)) {
                        throw lang_1.default('danger path param');
                    }
                    return [4 /*yield*/, ssh.execCommand("rm -rf " + remotePath)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4:
                    ss.succeed();
                    return [2 /*return*/];
            }
        });
    });
};
// 解压远程文件
var sshUnzipFileTask = function (ssh) {
    var remoteFiles = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        remoteFiles[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, remoteFiles_1, remoteFile, remotePath, sshCommand, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = 0, remoteFiles_1 = remoteFiles;
                    _b.label = 1;
                case 1:
                    if (!(_a < remoteFiles_1.length)) return [3 /*break*/, 4];
                    remoteFile = remoteFiles_1[_a];
                    ss.start('Unzip Remote File', ' ', chalk_1.default.magenta(remoteFile));
                    if (!remoteFile.endsWith('.zip')) {
                        throw lang_1.default('not found zip file');
                    }
                    if (!tools_1.isSafePath(remoteFile)) {
                        throw lang_1.default('danger path param');
                    }
                    //执行linux命令前将路径转为 linux分隔符
                    remoteFile = path_1.default.normalize(remoteFile).replace(/\\/g, '/');
                    remotePath = remoteFile.substring(0, remoteFile.lastIndexOf(path_1.default.basename(remoteFile)));
                    sshCommand = "unzip -o " + remoteFile + " -d " + remotePath + " && rm -rf " + remoteFile;
                    return [4 /*yield*/, ssh.execCommand(sshCommand)];
                case 2:
                    result = _b.sent();
                    if (result.code) { //code === 0 is OK
                        throw result.stderr;
                    }
                    ss.succeed();
                    _b.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
};
// 单文件改名
var sshRenameFileTask = function (ssh, remoteFile, newName) { return __awaiter(void 0, void 0, void 0, function () {
    var remotePath, newFile, sshCommand, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('Rename Remote File', ' ', chalk_1.default.magenta(remoteFile));
                if (remoteFile.endsWith('/')) {
                    throw lang_1.default('invalid file path') + ': ' + remoteFile;
                }
                if (newName.indexOf('/') >= 0) {
                    throw lang_1.default('invalid new file name') + ': ' + newName;
                }
                if (!tools_1.isSafePath(remoteFile)) {
                    throw lang_1.default('danger path param');
                }
                //执行linux命令前将路径转为 linux分隔符
                remoteFile = path_1.default.normalize(remoteFile).replace(/\\/g, '/');
                remotePath = remoteFile.substring(0, remoteFile.lastIndexOf(path_1.default.basename(remoteFile)));
                newFile = path_1.default.join(remotePath, newName).replace(/\\/g, '/');
                sshCommand = "mv " + remoteFile + " " + newFile;
                return [4 /*yield*/, ssh.execCommand(sshCommand)];
            case 1:
                result = _a.sent();
                if (result.code) { //code === 0 is OK
                    throw result.stderr;
                }
                ss.succeedAppend(" ", chalk_1.default.yellow(lang_1.default('to')), ' ', chalk_1.default.magenta(path_1.default.normalize(newFile)));
                return [2 /*return*/];
        }
    });
}); };
// 断开ssh
var sshDisconnectTask = function (ssh) {
    ss.start('SSH Disconnect');
    ssh.dispose();
    ss.succeed();
};
exports.default = (function (param) { return __awaiter(void 0, void 0, void 0, function () {
    var configFile, _i, param_1, envKey, currentEnv, localZipFileMap, _a, _b, projectPath, outputFile, _c, _d, ssh, remoteZipFileMap, _e, _f, projectPath, localZipFile, remoteFile, remotePath, _g, _h, _j, _k, remoteZipFile, _l, _m, projectPath, remoteFile, newName, e_1;
    var _o;
    return __generator(this, function (_p) {
        switch (_p.label) {
            case 0: return [4 /*yield*/, confirmDeployTask(param)];
            case 1:
                // 部署确认
                if (!(_p.sent()).confirm) {
                    return [2 /*return*/];
                }
                _p.label = 2;
            case 2:
                _p.trys.push([2, 31, , 33]);
                return [4 /*yield*/, getCorrectConfigFileTask(global_1.configFilePath, param)];
            case 3:
                configFile = _p.sent();
                if (!configFile) {
                    return [2 /*return*/];
                }
                _i = 0, param_1 = param;
                _p.label = 4;
            case 4:
                if (!(_i < param_1.length)) return [3 /*break*/, 29];
                envKey = param_1[_i];
                ss.info('Current Environment', ' ', chalk_1.default.blue.bold(envKey));
                currentEnv = configFile.env[envKey];
                // 执行打包命令
                return [4 /*yield*/, buildCodeTask(currentEnv.project.projectBuildScript)
                    // 执行归档命令
                ];
            case 5:
                // 执行打包命令
                _p.sent();
                localZipFileMap = {};
                _a = 0, _b = Object.keys(currentEnv.fileMap);
                _p.label = 6;
            case 6:
                if (!(_a < _b.length)) return [3 /*break*/, 10];
                projectPath = _b[_a];
                outputFile = getFilePathByProjectPath(projectPath);
                // 创建临时目录
                return [4 /*yield*/, createFolderTask(outputFile)];
            case 7:
                // 创建临时目录
                _p.sent();
                _c = localZipFileMap;
                _d = projectPath;
                return [4 /*yield*/, buildZipTask(projectPath, outputFile)];
            case 8:
                _c[_d] = _p.sent();
                _p.label = 9;
            case 9:
                _a++;
                return [3 /*break*/, 6];
            case 10: return [4 /*yield*/, sshConnectTask(currentEnv.server.serverHost, currentEnv.server.serverPort, currentEnv.server.serverUsername, configFile.local.sshPrivateKeyPath, configFile.local.sshPassphrase, currentEnv.server.serverPassword)
                // 清理远程目录
            ];
            case 11:
                ssh = _p.sent();
                if (!((_o = currentEnv.other) === null || _o === void 0 ? void 0 : _o.isClearServerPathBeforeDeploy)) return [3 /*break*/, 13];
                return [4 /*yield*/, sshRemoveFileTask.apply(void 0, __spreadArrays([ssh], Object.values(currentEnv.fileMap)))];
            case 12:
                _p.sent();
                _p.label = 13;
            case 13:
                remoteZipFileMap = {};
                _e = 0, _f = Object.keys(currentEnv.fileMap);
                _p.label = 14;
            case 14:
                if (!(_e < _f.length)) return [3 /*break*/, 18];
                projectPath = _f[_e];
                localZipFile = localZipFileMap[projectPath];
                remoteFile = void 0;
                remotePath = path_1.default.normalize(currentEnv.fileMap[projectPath]);
                return [4 /*yield*/, fs_1.promises.stat(path_1.default.join(process.cwd(), projectPath))];
            case 15:
                //原文件是文件，且目标目录不以/结尾，直接拷贝目标目录
                if ((_p.sent()).isFile() && !remotePath.replace(/\\/g, '/').endsWith('/')) {
                    remoteFile = path_1.default.join(remotePath.substring(0, remotePath.lastIndexOf(path_1.default.basename(remotePath))), path_1.default.basename(localZipFile));
                }
                else {
                    remoteFile = path_1.default.join(remotePath, path_1.default.basename(localZipFile));
                }
                _g = remoteZipFileMap;
                _h = projectPath;
                return [4 /*yield*/, sshUploadFileTask(ssh, localZipFile, remoteFile)];
            case 16:
                _g[_h] = (_p.sent());
                _p.label = 17;
            case 17:
                _e++;
                return [3 /*break*/, 14];
            case 18:
                _j = 0, _k = Object.values(remoteZipFileMap);
                _p.label = 19;
            case 19:
                if (!(_j < _k.length)) return [3 /*break*/, 22];
                remoteZipFile = _k[_j];
                return [4 /*yield*/, sshUnzipFileTask(ssh, remoteZipFile)];
            case 20:
                _p.sent();
                _p.label = 21;
            case 21:
                _j++;
                return [3 /*break*/, 19];
            case 22:
                _l = 0, _m = Object.keys(currentEnv.fileMap);
                _p.label = 23;
            case 23:
                if (!(_l < _m.length)) return [3 /*break*/, 27];
                projectPath = _m[_l];
                return [4 /*yield*/, fs_1.promises.stat(path_1.default.join(process.cwd(), projectPath))];
            case 24:
                if (!((_p.sent()).isFile() && !currentEnv.fileMap[projectPath].replace(/\\/g, '/').endsWith('/'))) return [3 /*break*/, 26];
                remoteFile = path_1.default.join(currentEnv.fileMap[projectPath].substring(0, currentEnv.fileMap[projectPath].lastIndexOf(path_1.default.basename(currentEnv.fileMap[projectPath]))), path_1.default.basename(projectPath));
                newName = path_1.default.basename(currentEnv.fileMap[projectPath]);
                if (!!remoteFile.endsWith(newName)) return [3 /*break*/, 26];
                return [4 /*yield*/, sshRenameFileTask(ssh, remoteFile, newName)];
            case 25:
                _p.sent();
                _p.label = 26;
            case 26:
                _l++;
                return [3 /*break*/, 23];
            case 27:
                sshDisconnectTask(ssh);
                _p.label = 28;
            case 28:
                _i++;
                return [3 /*break*/, 4];
            case 29: return [4 /*yield*/, removeFileTask(deployLocalTmpPath)];
            case 30:
                _p.sent();
                console.log(chalk_1.default.bgGreen.bold(' ' + lang_1.default('ALL DONE') + ' '));
                return [3 /*break*/, 33];
            case 31:
                e_1 = _p.sent();
                ss.fail();
                return [4 /*yield*/, removeFileTask(deployLocalTmpPath)];
            case 32:
                _p.sent();
                console.log(chalk_1.default.bgRed.bold(' ' + lang_1.default('ERROR INFO') + ' '));
                console.log(e_1);
                return [3 /*break*/, 33];
            case 33:
                process.exit();
                return [2 /*return*/];
        }
    });
}); });
//# sourceMappingURL=index.js.map