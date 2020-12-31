#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import init from '../lib/init'
import deploy from "../lib/deploy";
import {i18n} from '../lang'
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

const packageJsonFilePath = `${path.join(process.cwd())}/package.json`
const packageJsonFile = fs.existsSync(packageJsonFilePath) ? require(packageJsonFilePath) : {}
import {Command} from 'commander'
import {configFilePath} from '../utils/global'

const program = new Command();
program
    .version(packageJsonFile.version, '-v, --version', 'current version')

program.command('init')
    .description('init deploy configuration')
    .option('-l, --language <language_key>', 'language')
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

