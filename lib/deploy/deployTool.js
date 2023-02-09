"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sshDisconnect = exports.sshRenameFileByFullPath = exports.sshUnzipFile = exports.sshRemoveFile = exports.sshUploadFile = exports.sshConnect = exports.sshCheck = exports.removeFileSync = exports.removeFile = exports.buildZip = exports.createDir = exports.mkdirsSync = exports.getRemoteZipFilePath = exports.getLocalZipFilePathByProjectPath = exports.buildCode = exports.getCorrectConfigFile = exports.confirmDeploy = exports.deployLocalTmpPath = void 0;
var lang_1 = require("../../lang");
var chalk_1 = __importDefault(require("chalk"));
var node_ssh_1 = require("node-ssh");
var path_1 = __importDefault(require("path"));
var fs_extra_1 = __importDefault(require("fs-extra"));
var inquirer_1 = __importDefault(require("inquirer"));
var child_process_1 = __importDefault(require("child_process"));
var archiver_1 = __importDefault(require("archiver"));
var os_1 = __importDefault(require("os"));
var simpleSpinner_1 = __importDefault(require("../../utils/simpleSpinner"));
var tools_1 = require("../../utils/tools");
var global_1 = require("../../utils/global");
exports.deployLocalTmpPath = '.deployTmp' + '_' + Date.now();
// 确认是否部署提示
var confirmDeploy = function (param, envs) {
    return Promise.resolve(inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: function () { return 'Confirm' + param + '\n' + (0, lang_1.lang)('sure to deploy') + ' ' + chalk_1.default.magenta(envs.join(', ')) + ' ?'; },
        }
    ]));
};
exports.confirmDeploy = confirmDeploy;
// 检查配置文件
var getCorrectConfigFile = function (configFilePath, envKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var configFileFullPath, e_1, e_2, configFile, errorParamArr, isOk, _i, envKeys_1, envKey, envNode, serverNode, fileMapNode, _a, _b, key;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                simpleSpinner_1.default.start('Check Configuration', ' ', chalk_1.default.magenta(configFilePath + '[.js/.json]'));
                configFileFullPath = null;
                _c.label = 1;
            case 1:
                _c.trys.push([1, 3, , 4]);
                configFileFullPath = configFilePath + global_1.configFileExt.JS;
                return [4 /*yield*/, fs_extra_1.default.access(configFileFullPath, fs_extra_1.default.constants.F_OK)];
            case 2:
                _c.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _c.sent();
                configFileFullPath = null;
                return [3 /*break*/, 4];
            case 4:
                if (!!configFileFullPath) return [3 /*break*/, 8];
                _c.label = 5;
            case 5:
                _c.trys.push([5, 7, , 8]);
                configFileFullPath = configFilePath + global_1.configFileExt.JSON;
                return [4 /*yield*/, fs_extra_1.default.access(configFileFullPath, fs_extra_1.default.constants.F_OK)];
            case 6:
                _c.sent();
                return [3 /*break*/, 8];
            case 7:
                e_2 = _c.sent();
                configFileFullPath = null;
                return [3 /*break*/, 8];
            case 8:
                if (!configFileFullPath) {
                    throw 'config file ' + chalk_1.default.magenta(configFilePath + global_1.configFileExt.JS) + ' or ' + chalk_1.default.magenta(configFilePath + global_1.configFileExt.JSON) + ' not exist';
                }
                simpleSpinner_1.default.start('Check Configuration', ' ', chalk_1.default.magenta(configFileFullPath));
                configFile = require(configFileFullPath);
                errorParamArr = [];
                isOk = true;
                for (_i = 0, envKeys_1 = envKeys; _i < envKeys_1.length; _i++) {
                    envKey = envKeys_1[_i];
                    if (envKey in configFile.env) {
                        envNode = configFile.env[envKey];
                        serverNode = envNode.server;
                        if (!(serverNode === null || serverNode === void 0 ? void 0 : serverNode.serverHost)) {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'server.serverHost',
                                reason: (0, lang_1.lang)('not found or empty value')
                            });
                            isOk = false;
                        }
                        if (Object.prototype.toString.call(serverNode === null || serverNode === void 0 ? void 0 : serverNode.serverPort) !== '[object Number]') {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'server.serverPort',
                                reason: (0, lang_1.lang)('not found or NaN')
                            });
                            isOk = false;
                        }
                        if (!(serverNode === null || serverNode === void 0 ? void 0 : serverNode.serverUsername)) {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'server.serverUsername',
                                reason: (0, lang_1.lang)('not found or empty value')
                            });
                            isOk = false;
                        }
                        fileMapNode = envNode.fileMap;
                        if (!fileMapNode) {
                            errorParamArr.push({
                                param: 'env.' + envKey + 'fileMap',
                                reason: (0, lang_1.lang)('not found or empty value')
                            });
                            isOk = false;
                        }
                        else {
                            for (_a = 0, _b = Object.keys(fileMapNode); _a < _b.length; _a++) {
                                key = _b[_a];
                                if (!key) {
                                    errorParamArr.push({
                                        param: 'env.' + envKey + 'fileMap',
                                        reason: (0, lang_1.lang)('empty key')
                                    });
                                    isOk = false;
                                    continue;
                                }
                                if (path_1.default.normalize(fileMapNode[key]).replace(/\\/g, '/').match(/^\/.+?\/.+?/) === null) {
                                    errorParamArr.push({
                                        param: 'env.' + envKey + 'fileMap.' + key,
                                        reason: (0, lang_1.lang)('At least two levels of directories are required to use absolute paths')
                                    });
                                    isOk = false;
                                }
                            }
                        }
                    }
                    else {
                        errorParamArr.push({
                            param: envKey,
                            reason: (0, lang_1.lang)('unknown env')
                        });
                        isOk = false;
                    }
                }
                if (!isOk) {
                    throw errorParamArr.map(function (item) { return (0, lang_1.lang)('Error Param') + ' ' + chalk_1.default.magenta(item.param) + ' ' + chalk_1.default.red(item.reason); }).join('\r\n');
                }
                simpleSpinner_1.default.succeed('Check Configuration', ' ', chalk_1.default.magenta(configFileFullPath));
                return [2 /*return*/, configFile];
        }
    });
}); };
exports.getCorrectConfigFile = getCorrectConfigFile;
// 执行打包脚本
var buildCode = function (script, isVerbMode) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (isVerbMode) {
                    simpleSpinner_1.default.info('Build Code', ' ', chalk_1.default.magenta(script));
                }
                else {
                    simpleSpinner_1.default.start('Build Code', ' ', chalk_1.default.magenta(script));
                }
                if (script.length === 0) {
                    simpleSpinner_1.default.succeed();
                    return [2 /*return*/];
                }
                if (isVerbMode) {
                    console.log('--------------- Build Log Start ---------------');
                }
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var _a;
                        //子线程实时输出------------------------
                        var cp = child_process_1.default.spawn(script, [], {
                            shell: true,
                            cwd: process.cwd(),
                            env: process.env,
                            // stdio配置数组分别代表 subprocess.stdin, subprocess.stdout, and subprocess.stderr
                            // 值可为 'ignore','inherit','pipe','overlapped'
                            // 其中： subprocess.stdout 配置 inherit，可直接从父线程控制台输出；配置 pipe,可从cd.stdout.on('data') 监听输出内容
                            // 其中： subprocess.stderr 配置 inherit，可直接从父线程控制台输出；配置 pipe,可从cd.stderr.on('data') 监听输出内容
                            stdio: ['ignore', isVerbMode ? 'inherit' : 'pipe', 'pipe'],
                        });
                        cp.on('close', function () {
                            if (isVerbMode) {
                                console.log('--------------- Build Log End ---------------');
                                simpleSpinner_1.default.start('Build Code', ' ', chalk_1.default.magenta(script));
                            }
                            simpleSpinner_1.default.succeed();
                            resolve();
                        });
                        (_a = cp.stderr) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
                            if (isVerbMode) {
                                console.log('--------------- Build Log End ---------------');
                                simpleSpinner_1.default.start('Build Code', ' ', chalk_1.default.magenta(script));
                            }
                            reject('' + data);
                        });
                        cp.on('error', function (error) {
                            console.error('Failed to start subprocess.');
                            reject(error);
                        });
                        //子线结束后输出------------------------
                        //  childProcess.exec(
                        //      script,
                        //      {
                        //          cwd: process.cwd(),
                        //          maxBuffer: 5000 * 1024
                        //      },
                        //      (error: ExecException | null, stdout: string, stderr: string) => {
                        //          //console.log(stdout)
                        //          if (error) {
                        //              reject(error)
                        //          } else {
                        //              ss.succeed()
                        //              resolve()
                        //          }
                        //      }
                        //  )
                    })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
exports.buildCode = buildCode;
// 使用fileMap的key生成本地zip文件全名
var getLocalZipFilePathByProjectPath = function (projectPath) {
    return path_1.default.join(process.cwd(), exports.deployLocalTmpPath, path_1.default.basename(projectPath) + '_deploy.zip');
};
exports.getLocalZipFilePathByProjectPath = getLocalZipFilePathByProjectPath;
// 获取远程zip文件全路径
var getRemoteZipFilePath = function (projectPath, remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var localZipFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                localZipFile = (0, exports.getLocalZipFilePathByProjectPath)(projectPath);
                return [4 /*yield*/, fs_extra_1.default.stat(path_1.default.join(process.cwd(), projectPath))];
            case 1:
                //原文件是文件，且目标目录不以/结尾，直接拷贝目标目录
                if ((_a.sent()).isFile() && !remotePath.replace(/\\/g, '/').endsWith('/')) {
                    return [2 /*return*/, path_1.default.join(remotePath.substring(0, remotePath.lastIndexOf(path_1.default.basename(remotePath))), path_1.default.basename(localZipFile))];
                }
                else {
                    return [2 /*return*/, path_1.default.join(remotePath, path_1.default.basename(localZipFile))];
                }
                return [2 /*return*/];
        }
    });
}); };
exports.getRemoteZipFilePath = getRemoteZipFilePath;
// 递归创建目录
var mkdirsSync = function (dirname) {
    if (dirname === '' || fs_extra_1.default.existsSync(dirname)) {
        return true;
    }
    else {
        if ((0, exports.mkdirsSync)(path_1.default.dirname(dirname))) {
            fs_extra_1.default.mkdirSync(dirname);
            return true;
        }
    }
};
exports.mkdirsSync = mkdirsSync;
// 创建临时存储目录
var createDir = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var dirPath;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                dirPath = filePath.substring(0, filePath.lastIndexOf(path_1.default.basename(filePath)));
                if (fs_extra_1.default.existsSync(dirPath)) {
                    return [2 /*return*/];
                }
                simpleSpinner_1.default.start('LOCAL Create Dir', ' ', chalk_1.default.magenta(dirPath));
                return [4 /*yield*/, (0, exports.mkdirsSync)(dirPath)];
            case 1:
                _a.sent();
                simpleSpinner_1.default.succeed();
                return [2 /*return*/];
        }
    });
}); };
exports.createDir = createDir;
// 归档Zip
var buildZip = function (sourcePath, outputFile) { return __awaiter(void 0, void 0, void 0, function () {
    var archive, sourcePathStat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                sourcePath = path_1.default.join(process.cwd(), sourcePath);
                simpleSpinner_1.default.start('LOCAL Zip File', ' ', chalk_1.default.magenta(sourcePath));
                archive = (0, archiver_1.default)('zip', {
                    zlib: { level: 9 },
                    forceLocalTime: true
                });
                return [4 /*yield*/, fs_extra_1.default.stat(sourcePath)];
            case 1:
                sourcePathStat = _a.sent();
                if (sourcePathStat.isFile()) {
                    archive.file(sourcePath, { name: path_1.default.basename(sourcePath) });
                }
                else if (sourcePathStat.isDirectory()) {
                    archive.directory(sourcePath, false);
                }
                else {
                    throw (0, lang_1.lang)('unknown file type') + ': ' + sourcePath;
                }
                archive.pipe(fs_extra_1.default.createWriteStream(outputFile));
                return [4 /*yield*/, archive.finalize()];
            case 2:
                _a.sent();
                simpleSpinner_1.default.succeedAppend(" ", chalk_1.default.yellow((0, lang_1.lang)('to')), ' ', chalk_1.default.magenta(path_1.default.normalize(outputFile)));
                return [2 /*return*/];
        }
    });
}); };
exports.buildZip = buildZip;
// 删除本地文件
var removeFile = function (message) {
    var localPaths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        localPaths[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var isFileExist, _a, localPaths_1, localPath, _b, localPaths_2, localPath;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    isFileExist = false;
                    for (_a = 0, localPaths_1 = localPaths; _a < localPaths_1.length; _a++) {
                        localPath = localPaths_1[_a];
                        if (fs_extra_1.default.existsSync(localPath)) {
                            isFileExist = true;
                            break;
                        }
                    }
                    if (!isFileExist) {
                        return [2 /*return*/];
                    }
                    simpleSpinner_1.default.start('LOCAL Delete File', ' ', message);
                    _b = 0, localPaths_2 = localPaths;
                    _c.label = 1;
                case 1:
                    if (!(_b < localPaths_2.length)) return [3 /*break*/, 4];
                    localPath = localPaths_2[_b];
                    return [4 /*yield*/, fs_extra_1.default.remove(path_1.default.join(process.cwd(), localPath))];
                case 2:
                    _c.sent();
                    _c.label = 3;
                case 3:
                    _b++;
                    return [3 /*break*/, 1];
                case 4:
                    simpleSpinner_1.default.succeedAppend(' ', chalk_1.default.magenta(localPaths.map(function (localPath) { return path_1.default.normalize(path_1.default.join(process.cwd(), localPath)); }).join(' , ')));
                    return [2 /*return*/];
            }
        });
    });
};
exports.removeFile = removeFile;
// 删除本地文件，同步，线程退出时清理使用
var removeFileSync = function (message) {
    var localPaths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        localPaths[_i - 1] = arguments[_i];
    }
    var isFileExist = false;
    for (var _a = 0, localPaths_3 = localPaths; _a < localPaths_3.length; _a++) {
        var localPath = localPaths_3[_a];
        if (fs_extra_1.default.existsSync(localPath)) {
            isFileExist = true;
            break;
        }
    }
    if (!isFileExist) {
        return;
    }
    for (var _b = 0, localPaths_4 = localPaths; _b < localPaths_4.length; _b++) {
        var localPath = localPaths_4[_b];
        fs_extra_1.default.removeSync(path_1.default.join(process.cwd(), localPath));
    }
    console.log(' ' + chalk_1.default.bgGray('CLEAR UP') + ' ');
};
exports.removeFileSync = removeFileSync;
// 测试ssh连通
var sshCheck = function (host, port, username, privateKey, passphrase, password) { return __awaiter(void 0, void 0, void 0, function () {
    var sshConfig, answers, ssh;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
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
                            message: (0, lang_1.lang)('please input server password')
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
                simpleSpinner_1.default.start('SSH Test', ' ', chalk_1.default.magenta(host));
                return [4 /*yield*/, ssh.connect(sshConfig)];
            case 3:
                _a.sent();
                return [4 /*yield*/, ssh.dispose()];
            case 4:
                _a.sent();
                simpleSpinner_1.default.succeed();
                return [2 /*return*/, ssh];
        }
    });
}); };
exports.sshCheck = sshCheck;
// 连接ssh
var sshConnect = function (host, port, username, privateKey, passphrase, password) { return __awaiter(void 0, void 0, void 0, function () {
    var sshConfig, answers, ssh;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
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
                            message: (0, lang_1.lang)('please input server password')
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
                simpleSpinner_1.default.start('SSH Connect', ' ', chalk_1.default.magenta(host));
                return [4 /*yield*/, ssh.connect(sshConfig)];
            case 3:
                _a.sent();
                simpleSpinner_1.default.succeed();
                return [2 /*return*/, ssh];
        }
    });
}); };
exports.sshConnect = sshConnect;
// 上传文件
var sshUploadFile = function (ssh, localZipFile, remoteFile) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                simpleSpinner_1.default.start('REMOTE Upload File', ' ', chalk_1.default.magenta(localZipFile));
                return [4 /*yield*/, ssh.putFile(path_1.default.normalize(localZipFile), path_1.default.normalize(remoteFile), null, {
                        concurrency: 1
                    })];
            case 1:
                _a.sent();
                simpleSpinner_1.default.succeedAppend(" ", chalk_1.default.yellow((0, lang_1.lang)('to')), ' ', chalk_1.default.magenta(path_1.default.normalize(remoteFile)));
                return [2 /*return*/];
        }
    });
}); };
exports.sshUploadFile = sshUploadFile;
// 删除远程文件
var sshRemoveFile = function (ssh) {
    var remotePaths = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        remotePaths[_i - 1] = arguments[_i];
    }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, remotePaths_1, remotePath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    simpleSpinner_1.default.start('REMOTE Clean File Or Path');
                    _a = 0, remotePaths_1 = remotePaths;
                    _b.label = 1;
                case 1:
                    if (!(_a < remotePaths_1.length)) return [3 /*break*/, 4];
                    remotePath = remotePaths_1[_a];
                    if (!(0, tools_1.isSafePath)(remotePath)) {
                        throw (0, lang_1.lang)('danger path param');
                    }
                    return [4 /*yield*/, ssh.execCommand("rm -rf ".concat(remotePath))];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4:
                    simpleSpinner_1.default.succeedAppend(' ', chalk_1.default.magenta(remotePaths.map(function (item) { return path_1.default.normalize(item); }).join(' , ')));
                    return [2 /*return*/];
            }
        });
    });
};
exports.sshRemoveFile = sshRemoveFile;
// 解压远程文件
var sshUnzipFile = function (ssh) {
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
                    simpleSpinner_1.default.start('REMOTE Unzip And Delete File', ' ', chalk_1.default.magenta(remoteFile));
                    if (!remoteFile.endsWith('.zip')) {
                        throw (0, lang_1.lang)('not found zip file');
                    }
                    if (!(0, tools_1.isSafePath)(remoteFile)) {
                        throw (0, lang_1.lang)('danger path param');
                    }
                    //执行linux命令前将路径转为 linux分隔符
                    remoteFile = path_1.default.normalize(remoteFile).replace(/\\/g, '/');
                    remotePath = remoteFile.substring(0, remoteFile.lastIndexOf(path_1.default.basename(remoteFile)));
                    sshCommand = "unzip -o ".concat(remoteFile, " -d ").concat(remotePath, " && rm -f ").concat(remoteFile);
                    return [4 /*yield*/, ssh.execCommand(sshCommand)];
                case 2:
                    result = _b.sent();
                    if (result.code) { //code === 0 is OK
                        throw result.stderr;
                    }
                    simpleSpinner_1.default.succeed();
                    _b.label = 3;
                case 3:
                    _a++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
};
exports.sshUnzipFile = sshUnzipFile;
// 远程单文件改名
var sshRenameFile = function (ssh, remoteFile, newName) { return __awaiter(void 0, void 0, void 0, function () {
    var remotePath, newFile, sshCommand, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (remoteFile.endsWith('/')) {
                    throw (0, lang_1.lang)('invalid file path') + ': ' + remoteFile;
                }
                if (newName.indexOf('/') >= 0) {
                    throw (0, lang_1.lang)('invalid new file name') + ': ' + newName;
                }
                if (!(0, tools_1.isSafePath)(remoteFile)) {
                    throw (0, lang_1.lang)('danger path param');
                }
                //执行linux命令前将路径转为 linux分隔符
                remoteFile = path_1.default.normalize(remoteFile).replace(/\\/g, '/');
                remotePath = remoteFile.substring(0, remoteFile.lastIndexOf(path_1.default.basename(remoteFile)));
                newFile = path_1.default.join(remotePath, newName).replace(/\\/g, '/');
                sshCommand = "mv ".concat(remoteFile, " ").concat(newFile);
                return [4 /*yield*/, ssh.execCommand(sshCommand)];
            case 1:
                result = _a.sent();
                if (result.code) { //code === 0 is OK
                    throw result.stderr;
                }
                return [2 /*return*/, newFile];
        }
    });
}); };
//远程文件改名
var sshRenameFileByFullPath = function (ssh, projectPath, remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var remoteFileBeforeRename, newName, newFile;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, fs_extra_1.default.stat(path_1.default.join(process.cwd(), projectPath))];
            case 1:
                if (!((_a.sent()).isFile() && !remotePath.replace(/\\/g, '/').endsWith('/'))) return [3 /*break*/, 3];
                remoteFileBeforeRename = path_1.default.join(remotePath.substring(0, remotePath.lastIndexOf(path_1.default.basename(remotePath))), path_1.default.basename(projectPath));
                newName = path_1.default.basename(remotePath);
                if (!!remoteFileBeforeRename.endsWith(newName)) return [3 /*break*/, 3];
                simpleSpinner_1.default.start('REMOTE Rename File', ' ', chalk_1.default.magenta(remoteFileBeforeRename));
                return [4 /*yield*/, sshRenameFile(ssh, remoteFileBeforeRename, newName)];
            case 2:
                newFile = _a.sent();
                simpleSpinner_1.default.succeedAppend(" ", chalk_1.default.yellow((0, lang_1.lang)('to')), ' ', chalk_1.default.magenta(path_1.default.normalize(newFile)));
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sshRenameFileByFullPath = sshRenameFileByFullPath;
// 断开ssh
var sshDisconnect = function (ssh) {
    simpleSpinner_1.default.start('SSH Disconnect');
    ssh.dispose();
    simpleSpinner_1.default.succeed();
};
exports.sshDisconnect = sshDisconnect;
//# sourceMappingURL=deployTool.js.map