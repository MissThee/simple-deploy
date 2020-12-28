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
var ora_1 = __importDefault(require("ora"));
var lang_1 = __importDefault(require("../../lang"));
var param_1 = require("../../global/param");
var node_ssh_1 = require("node-ssh");
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var inquirer_1 = __importDefault(require("inquirer"));
var child_process_1 = __importDefault(require("child_process"));
var archiver_1 = __importDefault(require("archiver"));
var ssh = new node_ssh_1.NodeSSH();
var maxBuffer = 5000 * 1024;
// 任务列表
var taskList;
// 是否确认部署
var confirmDeploy = function () {
    return inquirer_1.default.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: lang_1.default('sure to deploy') + ' ?',
        }
    ]);
};
// 检查环境参数是否正确
var checkEnvParam = function (config) {
    var envKeys = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        envKeys[_i - 1] = arguments[_i];
    }
    var spinner = ora_1.default(lang_1.default('Checking')).start();
    var isOk = true;
    var unknownKeys = [];
    for (var _a = 0, envKeys_1 = envKeys; _a < envKeys_1.length; _a++) {
        var envKey = envKeys_1[_a];
        if (!(envKey in config.env)) {
            unknownKeys.push(envKey);
            isOk = false;
        }
    }
    if (isOk) {
        spinner.succeed(lang_1.default('Checking') + ' ' + lang_1.default('Done'));
    }
    else {
        spinner.fail('[' + unknownKeys.join(',') + '] not exist in ' + param_1.configFilePath);
    }
    return isOk;
};
// 执行打包脚本
var buildCode = function (script) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = ora_1.default(lang_1.default('Packing')).start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, new Promise(function (resolve, reject) {
                        var _a;
                        (_a = child_process_1.default.exec(script, {
                            cwd: process.cwd(),
                            maxBuffer: maxBuffer
                        }).on("error", function (err) {
                            spinner.fail(lang_1.default('Packing') + ' ' + lang_1.default('Error'));
                            spinner.fail(err.message);
                            process.exit(1);
                        }).on("exit", function (code, signal) {
                            spinner.succeed(lang_1.default('Packing') + ' ' + lang_1.default('Done'));
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
                spinner.fail(lang_1.default('Packing') + ' ' + lang_1.default('Error'));
                spinner.fail(e_1.message);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 递归创建目录
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
// 打包Zip
var buildZip = function (sourcePath, outputPath) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, sourcePathBasename, sourcePathPrePath, outputPathBasename, outputPathPrePath, output, archive;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = ora_1.default(lang_1.default('Archiving')).start();
                sourcePath = path_1.default.normalize(sourcePath);
                sourcePathBasename = path_1.default.basename(sourcePath);
                sourcePathPrePath = sourcePath.substring(0, sourcePath.indexOf(sourcePathBasename));
                if (!outputPath) {
                    outputPath = path_1.default.join(sourcePathPrePath, 'deployTmp', sourcePathBasename);
                }
                else {
                    outputPath = path_1.default.join(outputPath, sourcePathBasename);
                }
                outputPath = path_1.default.normalize(outputPath);
                outputPathBasename = path_1.default.basename(outputPath);
                outputPathPrePath = outputPath.substring(0, outputPath.indexOf(outputPathBasename));
                if (!fs_1.default.existsSync(path_1.default.join(process.cwd(), outputPathPrePath))) {
                    mkdirsSync(path_1.default.join(process.cwd(), outputPathPrePath));
                }
                output = fs_1.default
                    .createWriteStream(path_1.default.join(process.cwd(), outputPath + '.zip'))
                    .on('error', function (err) {
                    spinner.fail(lang_1.default('Archiving') + ' ' + lang_1.default('Error'));
                    spinner.fail(err.message);
                    process.exit(1);
                });
                archive = archiver_1.default('zip', {
                    zlib: { level: 9 }
                });
                archive.on('error', function (e) {
                    spinner.fail(lang_1.default('Archiving') + ' ' + lang_1.default('Error'));
                    spinner.fail(e.message);
                    process.exit(1);
                });
                archive.pipe(output);
                archive.directory(sourcePath, false);
                return [4 /*yield*/, archive.finalize()];
            case 1:
                _a.sent();
                spinner.succeed(lang_1.default('Archiving') + ' ' + lang_1.default('Done'));
                return [2 /*return*/];
        }
    });
}); };
// 连接ssh
var connectSSH = function (host, port, username, privateKey, passphrase, password) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, sshConfig, e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = ora_1.default(lang_1.default('SSH Connecting')).start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                sshConfig = {
                    host: host,
                    port: port,
                    username: username,
                    password: password,
                    privateKey: privateKey,
                    passphrase: passphrase,
                    tryKeyboard: true,
                };
                // if (!privateKey && !password) {
                //     const answers = await inquirer.prompt([
                //         {
                //             type: 'password',
                //             name: 'password',
                //             message: lang('please input password')
                //         }
                //     ])
                //     sshConfig.password = answers.password
                // }
                //
                // !privateKey && delete sshConfig.privateKey
                // !passphrase && delete sshConfig.passphrase
                return [4 /*yield*/, ssh.connect(sshConfig)];
            case 2:
                // if (!privateKey && !password) {
                //     const answers = await inquirer.prompt([
                //         {
                //             type: 'password',
                //             name: 'password',
                //             message: lang('please input password')
                //         }
                //     ])
                //     sshConfig.password = answers.password
                // }
                //
                // !privateKey && delete sshConfig.privateKey
                // !passphrase && delete sshConfig.passphrase
                _a.sent();
                spinner.succeed(lang_1.default('SSH Connecting') + ' ' + lang_1.default('Done'));
                return [3 /*break*/, 4];
            case 3:
                e_2 = _a.sent();
                spinner.fail(lang_1.default('SSH Connecting') + ' ' + lang_1.default('Error'));
                spinner.fail(e_2.message);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 上传本地文件
var uploadLocalFile = function (localPath, remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, e_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = ora_1.default(lang_1.default('Uploading')).start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                localPath = path_1.default.join(process.cwd(), localPath);
                return [4 /*yield*/, ssh.putFile(localPath, remotePath, null, {
                        concurrency: 1
                    })];
            case 2:
                _a.sent();
                spinner.succeed(lang_1.default('Uploading') + ' ' + lang_1.default('Done'));
                return [3 /*break*/, 4];
            case 3:
                e_3 = _a.sent();
                spinner.fail(lang_1.default('Uploading') + ' ' + lang_1.default('Error'));
                spinner.fail(e_3.message);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 删除远程文件
var removeRemoteFile = function (remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, e_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = ora_1.default(lang_1.default('Cleaning')).start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ssh.execCommand('rm -rf ' + remotePath)];
            case 2:
                _a.sent();
                spinner.succeed(lang_1.default('Cleaning') + ' ' + lang_1.default('Done'));
                return [3 /*break*/, 4];
            case 3:
                e_4 = _a.sent();
                spinner.fail(lang_1.default('Cleaning') + ' ' + lang_1.default('Error'));
                spinner.fail(e_4.message);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 解压远程文件
var unzipRemoteFile = function (remotePath) { return __awaiter(void 0, void 0, void 0, function () {
    var spinner, remoteFileName, e_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                spinner = ora_1.default(lang_1.default('Unpacking')).start();
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                remoteFileName = remotePath;
                return [4 /*yield*/, ssh.execCommand("unzip -o " + remotePath + " -d " + remotePath + " && rm -rf " + remotePath)];
            case 2:
                _a.sent();
                spinner.succeed(lang_1.default('Unpacking') + ' ' + lang_1.default('Done'));
                return [3 /*break*/, 4];
            case 3:
                e_5 = _a.sent();
                spinner.fail(lang_1.default('Cleaning') + ' ' + lang_1.default('Error'));
                spinner.fail(e_5.message);
                process.exit(1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
// 删除本地打包文件
var removeLocalFile = function (localPath) {
    var spinner = ora_1.default(lang_1.default('Deleting')).start();
    localPath = path_1.default.join(process.cwd(), localPath);
    var remove = function (path) {
        if (fs_1.default.existsSync(path)) {
            fs_1.default.readdirSync(path).forEach(function (file) {
                var currentPath = path + "/" + file;
                if (fs_1.default.statSync(currentPath).isDirectory()) {
                    remove(currentPath);
                }
                else {
                    fs_1.default.unlinkSync(currentPath);
                }
            });
            fs_1.default.rmdirSync(path);
        }
    };
    remove(localPath);
    fs_1.default.unlinkSync(localPath + ".zip");
    spinner.succeed(lang_1.default('Deleting') + ' ' + lang_1.default('Done'));
};
// 断开ssh
var disconnectSSH = function () {
    ssh.dispose();
};
var deploy = function (param) { return __awaiter(void 0, void 0, void 0, function () {
    var configFile, _i, param_2, envKey, currentEnv, tmpPath, _a, _b, localPath;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, confirmDeploy()];
            case 1:
                //部署动作确认
                if (!(_c.sent()).confirm) {
                    return [2 /*return*/];
                }
                //检查配置文件存在
                if (!fs_1.default.existsSync(param_1.configFilePath)) {
                    ora_1.default().fail(lang_1.default('deploy configuration not exist'));
                    return [2 /*return*/];
                }
                configFile = require(param_1.configFilePath);
                // 检查参数的环境是否存在于配置文件中
                if (!checkEnvParam.apply(void 0, __spreadArrays([configFile], param))) {
                    return [2 /*return*/];
                }
                _i = 0, param_2 = param;
                _c.label = 2;
            case 2:
                if (!(_i < param_2.length)) return [3 /*break*/, 5];
                envKey = param_2[_i];
                currentEnv = configFile.env[envKey];
                //执行打包命令
                return [4 /*yield*/, buildCode(currentEnv.project.projectBuildScript)
                    //执行归档命令
                ];
            case 3:
                //执行打包命令
                _c.sent();
                tmpPath = '/deployTmp';
                for (_a = 0, _b = Object.keys(currentEnv.fileMap); _a < _b.length; _a++) {
                    localPath = _b[_a];
                    buildZip(localPath, tmpPath);
                }
                //删除临时文件
                removeLocalFile(tmpPath);
                _c.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.default = deploy;
//# sourceMappingURL=index.js.map