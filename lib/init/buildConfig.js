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
var inquirer_1 = __importDefault(require("inquirer"));
var fs_1 = __importDefault(require("fs"));
var os_1 = __importDefault(require("os"));
var path_1 = __importDefault(require("path"));
var lang_1 = __importDefault(require("../../lang"));
var chalk_1 = __importDefault(require("chalk"));
var ora_1 = __importDefault(require("ora"));
var packageJsonFileFullName = 'package.json';
var packageJsonFilePath = path_1.default.join(process.cwd(), packageJsonFileFullName);
var packageJsonFile = fs_1.default.existsSync(packageJsonFilePath) ? require(packageJsonFilePath) : {};
// 本机配置（项目名，ssh相关）
var inquirerLocalConfig = [
    {
        type: 'input',
        name: 'projectName',
        message: lang_1.default('projectName'),
        default: function () {
            return packageJsonFile.name || 'unknown';
        }
    },
    {
        type: 'input',
        name: 'sshPrivateKeyPath',
        message: lang_1.default('sshPrivateKeyPath'),
        default: path_1.default.join(os_1.default.homedir(), '/.ssh/id_rsa')
    },
    {
        type: 'password',
        name: 'sshPassphrase',
        message: lang_1.default('sshPassphrase'),
    },
];
// 部署环境设置（有几种部署环境）
var inquirerDeployEnvTypesConfig = [
    {
        type: 'input',
        name: 'deployEnvTypes',
        message: lang_1.default('deployEnvTypes') + lang_1.default('[') + '"dev,test,prod" ' + lang_1.default('no space') + ']',
        default: 'dev',
        filter: function (input) {
            if (input) {
                input = input
                    .replace(/，/g, ',')
                    .replace(/ /g, '')
                    .replace(/,+/g, ',');
                if (input.lastIndexOf(',') === input.length - 1) {
                    input = input.substring(0, input.length - 1);
                }
                return input;
            }
            else {
                return '';
            }
        }
    }
];
// 项目信息设置（项目打包命令）
var inquirerProjectConfig = [
    {
        type: 'list',
        name: 'projectBuildScript',
        message: lang_1.default('projectBuildScript'),
        choices: function () {
            var choices = [];
            if (packageJsonFile.scripts) {
                for (var _i = 0, _a = Object.keys(packageJsonFile.scripts); _i < _a.length; _i++) {
                    var key = _a[_i];
                    var value = packageJsonFile.scripts[key];
                    choices.push({
                        name: chalk_1.default.magenta('"' + key + '"') +
                            chalk_1.default.yellow(':') +
                            chalk_1.default.green(' "' + value + '"'),
                        value: '[command]' + value
                    });
                }
            }
            choices.push({ name: lang_1.default('custom') + ' (' + lang_1.default('type by myself') + ')', value: '[custom]' });
            return choices;
        }
    },
    {
        type: 'input',
        name: 'projectBuildCustomScript',
        message: lang_1.default('projectBuildCustomScript'),
        when: function (answer) { return !answer.projectBuildScript.indexOf('[custom]'); }
    }
];
// 服务器信息设置（Host，Port，用户名，密码）
var inquirerServerConfig = [
    {
        type: 'input',
        name: 'serverHost',
        message: lang_1.default('serverHost'),
    },
    {
        type: 'number',
        name: 'serverPort',
        message: lang_1.default('serverPort'),
        default: 22,
        validate: function (input) {
            return !isNaN(input);
        }
    },
    {
        type: 'input',
        name: 'serverUsername',
        message: lang_1.default('serverUsername'),
        default: 'root',
    },
    {
        type: 'password',
        name: 'serverPassword',
        message: lang_1.default('serverPassword'),
    },
];
// 部署路径设置（文件拷贝映射信息）
var inquirerFileMapConfig = [
    {
        type: 'confirm',
        name: 'isSingleProjectDistPath',
        message: lang_1.default('isSingleProjectDistPath'),
        default: true,
    },
    {
        type: 'editor',
        name: 'fileMap',
        message: lang_1.default('fileMap') + ' {"localPath":"serverPath"}',
        default: JSON.stringify({}),
        when: (function (answer) { return !answer.isSingleProjectDistPath; }),
        validate: function (input) {
            var result = true;
            try {
                JSON.parse(input);
            }
            catch (e) {
                result = false;
            }
            if (!input.trimStart().startsWith('{')) {
                result = false;
            }
            return result;
        }
    },
    {
        type: 'input',
        name: 'projectDistPath',
        message: lang_1.default('projectDistPath'),
        default: 'dist',
        when: (function (answer) { return answer.isSingleProjectDistPath; })
    },
    {
        type: 'input',
        name: 'serverDeployPath',
        message: lang_1.default('serverDeployPath') + ' (' + lang_1.default('Absolute path') + '. ' + lang_1.default('At least two levels of directory') + ')',
        when: (function (answer) { return answer.isSingleProjectDistPath; }),
        validate: function (input) {
            return input.match(/^\/.+?\/.+?/) !== null;
        }
    },
    {
        type: 'confirm',
        name: 'isClearServerPathBeforeDeploy',
        message: lang_1.default('isClearServerPathBeforeDeploy'),
        default: true,
    }
];
var buildConfig = function () { return __awaiter(void 0, void 0, void 0, function () {
    var local, env, deployEnvTypesConfig, _i, _a, key, currentEnv, projectConfig, _b, fileMap, deployConfig;
    var _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0: return [4 /*yield*/, inquirer_1.default.prompt(inquirerLocalConfig)];
            case 1:
                local = _d.sent();
                env = {};
                return [4 /*yield*/, inquirer_1.default.prompt(inquirerDeployEnvTypesConfig)];
            case 2:
                deployEnvTypesConfig = _d.sent();
                _i = 0, _a = deployEnvTypesConfig.deployEnvTypes.split(',').filter(function (item) { return item; });
                _d.label = 3;
            case 3:
                if (!(_i < _a.length)) return [3 /*break*/, 8];
                key = _a[_i];
                // 输出当前配置环境提示 dev/test/prod
                ora_1.default().info(chalk_1.default.blueBright(lang_1.default('Environment Configuration')) + chalk_1.default.yellow(": ") + chalk_1.default.bgGreen.bold(' ' + key + ' '));
                currentEnv = {
                    project: {
                        projectBuildScript: ""
                    },
                    fileMap: {},
                    server: {
                        serverHost: "",
                        serverPort: 0,
                        serverUsername: ""
                    }
                };
                return [4 /*yield*/, inquirer_1.default.prompt(inquirerProjectConfig)];
            case 4:
                projectConfig = _d.sent();
                if (projectConfig.projectBuildScript.indexOf('[custom]')) {
                    projectConfig = projectConfig.projectBuildScript.replace('[command]', '');
                }
                else {
                    projectConfig = projectConfig.projectBuildCustomScript.replace('[custom]', '');
                }
                currentEnv.project = { projectBuildScript: projectConfig };
                _b = currentEnv;
                return [4 /*yield*/, inquirer_1.default.prompt(inquirerServerConfig)];
            case 5:
                _b.server = _d.sent();
                return [4 /*yield*/, inquirer_1.default.prompt(inquirerFileMapConfig)];
            case 6:
                fileMap = _d.sent();
                if (fileMap.isSingleProjectDistPath) {
                    fileMap = (_c = {}, _c[fileMap.projectDistPath] = fileMap.serverDeployPath, _c);
                }
                currentEnv.fileMap = fileMap;
                env[key] = currentEnv;
                _d.label = 7;
            case 7:
                _i++;
                return [3 /*break*/, 3];
            case 8:
                deployConfig = {
                    local: local,
                    env: env
                };
                return [2 /*return*/, deployConfig];
        }
    });
}); };
exports.default = buildConfig;
//# sourceMappingURL=buildConfig.js.map