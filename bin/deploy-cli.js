#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
var init_1 = __importDefault(require("../lib/init"));
var deploy_1 = __importDefault(require("../lib/deploy"));
// console.log('process.env', process.env)
// 解析命令内容，执行命令：node deploy-cli.js deploy --mode prod
// console.log('process.argv', process.argv)
// [
//   'C:\\Program Files\\nodejs\\node.exe',
//   'T:\\deploy-cli\\bin\\deploy-cli.js',
//   'deploy',
//   '--mode',
//   'prod'
// ]
// const argvPart = process.argv.slice(2)// [ 'deploy', '--mode', 'prod' ]
// const args = minimist(argvPart)// { _: [ 'deploy' ], mode: 'prod' }
var packageJsonFilePath = path_1.default.join(process.cwd()) + "/package.json";
var packageJsonFile = fs_1.default.existsSync(packageJsonFilePath) ? require(packageJsonFilePath) : {};
var commander_1 = require("commander");
var global_1 = require("../utils/global");
var program = new commander_1.Command();
program
    .version(packageJsonFile.version, '-v, --version', 'current version');
program.command('init')
    .description('init deploy configuration')
    .action(function () {
    init_1.default(global_1.configFilePath);
});
//注意此处不能直接链式直接使用.command，会被认为是上一个command的子指令。需要重新使用program添加.command指令
program.command('deploy', { isDefault: true })
    .description('deploy file')
    .option('-e, --environment <environment_key...>', 'declare environment')
    .action(function (opts) {
    deploy_1.default(opts.environment);
    // console.log('部署deploy', '输出参opts.environment', opts.environment)
});
program.parse(process.argv);
//# sourceMappingURL=deploy-cli.js.map