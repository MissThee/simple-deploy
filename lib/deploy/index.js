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
var ora_1 = __importDefault(require("ora"));
var lang_1 = __importDefault(require("../../lang"));
var chalk_1 = __importDefault(require("chalk"));
var global_1 = require("../../utils/global");
var node_ssh_1 = require("node-ssh");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var inquirer_1 = __importDefault(require("inquirer"));
var child_process_1 = __importDefault(require("child_process"));
var archiver_1 = __importDefault(require("archiver"));
var os_1 = __importDefault(require("os"));
var ssh = new node_ssh_1.NodeSSH();
var maxBuffer = 5000 * 1024;
var currentTimestamp = '_' + Date.now();
var deployLocalTmpPath = '.deployTmp' + currentTimestamp;
var zipFileIndex = 0;
var SimpleSpinner = /** @class */ (function () {
    function SimpleSpinner() {
        this.spinner = ora_1.default();
    }
    SimpleSpinner.prototype.start = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        this.spinner.start(value.map(function (item) { return lang_1.default(item); }).join(''));
    };
    SimpleSpinner.prototype.succeed = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        this.spinner.succeed(value.map(function (item) { return lang_1.default(item); }).join(''));
    };
    SimpleSpinner.prototype.fail = function (err) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        this.spinner.fail(value.map(function (item) { return lang_1.default(item); }).join(''));
        console.log('' + err);
    };
    SimpleSpinner.prototype.info = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        this.spinner.info(value.map(function (item) { return lang_1.default(item); }).join(''));
    };
    return SimpleSpinner;
}());
var ss = new SimpleSpinner();
// 是否确认部署
var confirmDeployTask = function (param) {
    return inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: lang_1.default('sure to deploy') + ' ' + chalk_1.default.magenta.bold(param.join(',')) + ' ?',
        }
    ]);
};
var getCorrectConfigFileTask = function (configFilePath, envKeys) { return __awaiter(void 0, void 0, void 0, function () {
    var configFile, errorParamArr, isOk, _i, envKeys_1, envKey, envNode, projectNode, serverNode, fileMapNode, _a, _b, key;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                ss.start('Check Configuration', ' ', chalk_1.default.magenta(configFilePath));
                //检查配置文件存在
                if (!fs_1.default.existsSync(configFilePath)) {
                    ss.fail('deploy configuration not exist');
                    return [2 /*return*/];
                }
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
                        if (isNaN(serverNode === null || serverNode === void 0 ? void 0 : serverNode.serverPort)) {
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
                    errorParamArr.forEach(function (item) {
                        ss.fail('Error Param', ' ', item.param, ' ', chalk_1.default.red(item.reason));
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, setTimeout(function () {
                    }, 1000)];
            case 1:
                _c.sent();
                ss.succeed();
                return [2 /*return*/, configFile];
        }
    });
}); };
// 执行打包脚本
var buildCodeTask = function (script) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('Build Code', ' ', chalk_1.default.magenta(script));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var _a;
                        (_a = child_process_1.default.exec(script, {
                            cwd: process.cwd(),
                            maxBuffer: maxBuffer
                        }).on("error", function (err) {
                            ss.fail(err.message);
                            process.exit();
                        }).on("exit", function (code, signal) {
                            ss.succeed();
                            resolve();
                        }).stderr) === null || _a === void 0 ? void 0 : _a.on('data', function (data) {
                            console.log('Error msg from process 2: ' + data);
                        });
                    })];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                e_1 = _a.sent();
                ss.fail(e_1.toString());
                process.exit();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 使用fileMap的key生成本地zip文件全名
var getFilePathByProjectPath = function (projectPath) {
    return path_1.default.join(process.cwd(), deployLocalTmpPath, zipFileIndex++ + '_' + path_1.default.basename(projectPath) + '.zip');
};
// 归档Zip
var buildZipTask = function (sourcePath) { return __awaiter(void 0, void 0, void 0, function () {
    var mkdirsSync, outputPathAbsolute, outputFile, archive, sourcePathStat;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('Zip Local File', ' ', chalk_1.default.magenta(sourcePath));
                mkdirsSync = function (dirname) {
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
                outputPathAbsolute = path_1.default.join(process.cwd(), deployLocalTmpPath);
                if (!fs_1.default.existsSync(outputPathAbsolute)) {
                    mkdirsSync(outputPathAbsolute);
                }
                outputFile = getFilePathByProjectPath(sourcePath);
                archive = archiver_1.default('zip', {
                    zlib: { level: 9 }
                });
                sourcePathStat = fs_1.default.statSync(sourcePath);
                if (sourcePathStat.isFile()) {
                    archive.file(sourcePath, { name: path_1.default.basename(sourcePath) });
                }
                else if (sourcePathStat.isDirectory()) {
                    archive.directory(sourcePath, false);
                }
                else {
                    ss.fail(lang_1.default('unknown file type') + ': ' + sourcePath);
                    process.exit();
                }
                archive.pipe(fs_1.default.createWriteStream(outputFile));
                return [4 /*yield*/, archive.finalize()];
            case 1:
                _a.sent();
                ss.succeed();
                return [2 /*return*/, outputFile];
        }
    });
}); };
// 连接ssh
var connectSSHTask = function (host, port, username, privateKey, passphrase, password) { return __awaiter(void 0, void 0, void 0, function () {
    var sshConfig, answers, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('SSH Connect', ' ', chalk_1.default.magenta(host));
                if (privateKey && privateKey.trimStart().startsWith('~')) {
                    privateKey = path_1.default.join(os_1.default.homedir(), privateKey.substring(privateKey.indexOf('~') + 1));
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 5, , 6]);
                sshConfig = {
                    host: host,
                    port: port,
                    username: username,
                    password: password,
                    privateKey: privateKey,
                    passphrase: passphrase,
                    tryKeyboard: true,
                };
                if (!(!privateKey && !password)) return [3 /*break*/, 3];
                return [4 /*yield*/, inquirer_1.default.prompt([
                        {
                            type: 'password',
                            name: 'password',
                            message: lang_1.default('please input password')
                        }
                    ])];
            case 2:
                answers = _a.sent();
                sshConfig.password = answers.password;
                _a.label = 3;
            case 3:
                !password && delete sshConfig.password;
                !privateKey && delete sshConfig.privateKey;
                !passphrase && delete sshConfig.passphrase;
                // !privateKey && delete sshConfig.privateKey
                // !passphrase && delete sshConfig.passphrase
                return [4 /*yield*/, ssh.connect(sshConfig)];
            case 4:
                // !privateKey && delete sshConfig.privateKey
                // !passphrase && delete sshConfig.passphrase
                _a.sent();
                ss.succeed();
                return [3 /*break*/, 6];
            case 5:
                e_2 = _a.sent();
                ss.fail(e_2.toString());
                process.exit();
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
// 上传本地文件
var uploadLocalFileTask = function (localFile, remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var remoteFile, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('Upload File', ' ', chalk_1.default.magenta(localFile));
                remoteFile = path_1.default.join(remotePath, path_1.default.basename(localFile));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ssh.putFile(localFile, remoteFile, null, {
                        concurrency: 1
                    })];
            case 2:
                _a.sent();
                ss.succeed();
                return [2 /*return*/, remoteFile];
            case 3:
                e_3 = _a.sent();
                ss.fail(e_3.toString());
                process.exit();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 删除远程文件
var removeRemoteFileTask = function (remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('Clean');
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ssh.execCommand('rm -rf ' + remotePath)];
            case 2:
                _a.sent();
                ss.succeed();
                return [3 /*break*/, 4];
            case 3:
                e_4 = _a.sent();
                ss.fail(e_4.toString());
                process.exit();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 解压远程文件
var unzipRemoteFile = function (remoteFile) { return __awaiter(void 0, void 0, void 0, function () {
    var remotePath, sshCommand, result, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                ss.start('Unzip Remote File', ' ', chalk_1.default.magenta(remoteFile));
                if (!remoteFile.endsWith('.zip')) {
                    ss.fail(lang_1.default('not found zip file'));
                    process.exit();
                }
                if (path_1.default.normalize(remoteFile).replace(/\\/g, '/').match(/^\/.+?\/.+?/) === null) {
                    ss.fail(lang_1.default('danger path param'));
                    process.exit();
                }
                //执行linux命令前将路径转为 linux分隔符
                remoteFile = path_1.default.normalize(remoteFile).replace(/\\/g, '/');
                remotePath = remoteFile.substring(0, remoteFile.lastIndexOf(path_1.default.basename(remoteFile)));
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                sshCommand = "unzip -o " + remoteFile + " -d " + remotePath + " && rm -rf " + remoteFile;
                return [4 /*yield*/, ssh.execCommand(sshCommand)];
            case 2:
                result = _a.sent();
                if (result.code) {
                    ss.fail(result.stderr);
                    process.exit();
                }
                ss.succeed();
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                ss.fail(e_5.toString());
                process.exit();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 删除本地打包文件
var removeLocalFile = function (localPath) {
    localPath = path_1.default.join(process.cwd(), localPath);
    ss.start('Clean Local Tmp', ' ', chalk_1.default.magenta(localPath));
    return new Promise(function (resolve, reject) {
        fs_1.default.rm(localPath, { recursive: true, force: true }, function (err) {
            if (err) {
                ss.fail(err.message);
                process.exit();
            }
            else {
                ss.succeed();
                resolve();
            }
        });
    });
};
// 断开ssh
var disconnectSSH = function () {
    ss.start('SSH Disconnect');
    ssh.dispose();
    ss.succeed();
};
var deploy = function (param) { return __awaiter(void 0, void 0, void 0, function () {
    var configFile, _i, param_1, envKey, currentEnv, zipTmpFileMap, _a, _b, projectPath, _c, _d, remoteZipFileArr, _e, _f, projectPath, _g, _h, _j, remoteZipFileArr_1, remoteZipFile, e_6;
    return __generator(this, function (_k) {
        switch (_k.label) {
            case 0:
                _k.trys.push([0, 20, , 22]);
                return [4 /*yield*/, confirmDeployTask(param)];
            case 1:
                // 部署确认
                if (!(_k.sent()).confirm) {
                    return [2 /*return*/];
                }
                return [4 /*yield*/, getCorrectConfigFileTask(global_1.configFilePath, param)];
            case 2:
                configFile = _k.sent();
                if (!configFile) {
                    return [2 /*return*/];
                }
                _i = 0, param_1 = param;
                _k.label = 3;
            case 3:
                if (!(_i < param_1.length)) return [3 /*break*/, 18];
                envKey = param_1[_i];
                ss.info(chalk_1.default.bgBlue.bold(' ' + envKey + ' '));
                currentEnv = configFile.env[envKey];
                // 执行打包命令
                return [4 /*yield*/, buildCodeTask(currentEnv.project.projectBuildScript)
                    // 执行归档命令
                ];
            case 4:
                // 执行打包命令
                _k.sent();
                zipTmpFileMap = {};
                _a = 0, _b = Object.keys(currentEnv.fileMap);
                _k.label = 5;
            case 5:
                if (!(_a < _b.length)) return [3 /*break*/, 8];
                projectPath = _b[_a];
                _c = zipTmpFileMap;
                _d = projectPath;
                return [4 /*yield*/, buildZipTask(projectPath)];
            case 6:
                _c[_d] = _k.sent();
                _k.label = 7;
            case 7:
                _a++;
                return [3 /*break*/, 5];
            case 8: 
            //连接ssh
            return [4 /*yield*/, connectSSHTask(currentEnv.server.serverHost, currentEnv.server.serverPort, currentEnv.server.serverUsername, configFile.local.sshPrivateKeyPath, configFile.local.sshPassphrase, currentEnv.server.serverPassword)];
            case 9:
                //连接ssh
                _k.sent();
                remoteZipFileArr = [];
                _e = 0, _f = Object.keys(currentEnv.fileMap);
                _k.label = 10;
            case 10:
                if (!(_e < _f.length)) return [3 /*break*/, 13];
                projectPath = _f[_e];
                _h = (_g = remoteZipFileArr).push;
                return [4 /*yield*/, uploadLocalFileTask(zipTmpFileMap[projectPath], currentEnv.fileMap[projectPath])];
            case 11:
                _h.apply(_g, [_k.sent()]);
                _k.label = 12;
            case 12:
                _e++;
                return [3 /*break*/, 10];
            case 13:
                _j = 0, remoteZipFileArr_1 = remoteZipFileArr;
                _k.label = 14;
            case 14:
                if (!(_j < remoteZipFileArr_1.length)) return [3 /*break*/, 17];
                remoteZipFile = remoteZipFileArr_1[_j];
                return [4 /*yield*/, unzipRemoteFile(remoteZipFile)];
            case 15:
                _k.sent();
                _k.label = 16;
            case 16:
                _j++;
                return [3 /*break*/, 14];
            case 17:
                _i++;
                return [3 /*break*/, 3];
            case 18:
                disconnectSSH();
                //删除本地临时文件
                return [4 /*yield*/, removeLocalFile(deployLocalTmpPath)];
            case 19:
                //删除本地临时文件
                _k.sent();
                ss.succeed(chalk_1.default.bgGreen.bold(lang_1.default('All Done')));
                return [3 /*break*/, 22];
            case 20:
                e_6 = _k.sent();
                ss.fail(e_6);
                //删除本地临时文件
                return [4 /*yield*/, removeLocalFile(deployLocalTmpPath)];
            case 21:
                //删除本地临时文件
                _k.sent();
                return [3 /*break*/, 22];
            case 22:
                process.exit();
                return [2 /*return*/];
        }
    });
}); };
exports.default = deploy;
//# sourceMappingURL=index.js.map