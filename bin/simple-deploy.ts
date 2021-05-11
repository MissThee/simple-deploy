#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import init from '../lib/init'
import deploy from "../lib/deploy";
import {i18n} from '../lang'
// 1、在package.json中配置
// "bin": {
//     "simple-deploy": "bin/simple-deploy.js"
// }
// 其中key值为安装本cli后，启动本cli的指令

// 2、解析命令内容
// 如 simple-deploy deploy --mode prod
const packageJsonFilePath = `${path.join(process.cwd())}/package.json`
const packageJsonFile = fs.existsSync(packageJsonFilePath) ? require(packageJsonFilePath) : {}
import {Command} from 'commander'
import {configFilePath} from '../utils/global'
import {NodeSSH} from "node-ssh";

const program = new Command();
program
    .version(packageJsonFile.version, '-v, --version', 'current version')

program.command('init')// 决定解析命令后，执行哪块儿代码
    .description('init deploy configuration')
    .option('-l, --language <language_key>', 'language') // --language 决定opts中属性
    .action(async (opts: any) => {
        i18n.setLang(opts.language)
        await init(configFilePath);
    })
//注意此处不能直接链式直接使用.command，会被认为是上一个command的子指令。需要重新使用program添加.command指令
program.command('deploy', {isDefault: true})
    .description('deploy file')
    .option('-e, --environment <environment_key...>', 'deploy environment')
    .option('-l, --language <language_key>', 'language')
    .action(async (opts: any) => {
        i18n.setLang(opts.language)
        await deploy(opts.environment)
    })

program.parse(process.argv)

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
