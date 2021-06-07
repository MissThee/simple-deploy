#!/usr/bin/env node
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
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var init_1 = __importDefault(require("../lib/init"));
var deploy_1 = __importDefault(require("../lib/deploy"));
var lang_1 = require("../lang");
var checkForUpdates_1 = __importDefault(require("../utils/checkForUpdates"));
// 1、在package.json中配置
// "bin": {
//     "simple-deploy": "bin/simple-deploy.js"
// }
// 其中key值为安装本cli后，启动本cli的指令
// 2、解析命令内容
// 如 simple-deploy deploy --mode prod
var packageJsonFilePath = path_1.default.join(process.cwd()) + "/package.json";
var packageJsonFile = fs_1.default.existsSync(packageJsonFilePath) ? require(packageJsonFilePath) : {};
var commander_1 = require("commander");
var global_1 = require("../utils/global");
var program = new commander_1.Command();
program
    .version(packageJsonFile.version, '-v, --version', 'current version');
program.command('init') // 决定解析命令后，执行哪块儿代码
    .description('init deploy configuration')
    .option('-l, --language <language_key>', 'language') // --language 决定opts中属性
    .action(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var e_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lang_1.i18n.setLang(opts.language);
                return [4 /*yield*/, init_1.default(global_1.configFilePath)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, checkForUpdates_1.default()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_1 = _a.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
//注意此处不能直接链式直接使用.command，会被认为是上一个command的子指令。需要重新使用program添加.command指令
program.command('deploy', { isDefault: true })
    .description('deploy file')
    .option('-e, --environment <environment_key...>', 'deploy environment')
    .option('-l, --language <language_key>', 'language')
    .option('-d, --directly', 'execute deploy process directly')
    .action(function (opts) { return __awaiter(void 0, void 0, void 0, function () {
    var e_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                lang_1.i18n.setLang(opts.language);
                return [4 /*yield*/, deploy_1.default(opts)];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                _a.trys.push([2, 4, , 5]);
                return [4 /*yield*/, checkForUpdates_1.default()];
            case 3:
                _a.sent();
                return [3 /*break*/, 5];
            case 4:
                e_2 = _a.sent();
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); });
program.parse(process.argv);
// nodejs解析命令
// 如执行命令：node bin/simple-deploy,js deploy --mode prod
// console.log('process.argv', process.argv)
// 输出[
//   'C:\\Program Files\\nodejs\\node.exe',
//   'T:\\deploy-cli\\bin\\deploy-cli.js',
//   'deploy',
//   '--mode',
//   'prod'
// ]
// 提取参数
// const argvPart = process.argv.slice(2)// 输出[ 'deploy', '--mode', 'prod' ]
// const args = minimist(argvPart)// 输出{ _: [ 'deploy' ], mode: 'prod' }
//# sourceMappingURL=simple-deploy.js.map