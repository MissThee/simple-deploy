#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import init from '../lib/init'
import deploy from "../lib/deploy";
import {i18n} from '../lang'
import checkForUpdates from '../utils/checkForUpdates'
import {Command} from 'commander'
import {configFilePath} from '../utils/global'
import clearTerminal from "../utils/clearTerminal";

const packageJsonFilePath = `${path.join(process.cwd())}/package.json`
const packageJsonFile = fs.existsSync(packageJsonFilePath) ? require(packageJsonFilePath) : {}

let updateTip = ''
checkForUpdates().then((res) => {
    updateTip = res
})

const program = new Command();
program
    .version(packageJsonFile.version, '-v, --version', 'current version')

program.command('init')// 决定解析命令后，执行哪块儿代码
    .description('init deploy configuration')
    .option('-l, --language <language_key>', 'language') // --language 决定opts中属性
    .action(async (opts: any) => {
        clearTerminal()
        i18n.setLang(opts.language)
        await init(configFilePath);
        console.log(updateTip)
        process.exit()
    })

program.command('deploy', {isDefault: true})
    .description('deploy file')
    .option('-e, --environment <environment_key...>', 'deploy environment')
    .option('-l, --language <language_key>', 'language')
    .option('-d, --directly', 'execute deploy process directly')
    .action(async (opts: any) => {
        clearTerminal()
        i18n.setLang(opts.language)
        await deploy(opts)
        console.log(updateTip)
        process.exit()
    })

program.parse(process.argv)


// program.command().command()
// program.command();   program.command();
// 注意直接链式直接使用.command，会被认为是上一个command的子指令。需要重新使用program添加.command指令

// 如何构造node指令
// 1、在package.json中配置
// "bin": {
//     "simple-deploy": "bin/simple-deploy.js"
// }
// 其中key值为安装本cli后，启动本cli的指令

// 2、解析命令内容
// 如 simple-deploy deploy --mode prod

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
