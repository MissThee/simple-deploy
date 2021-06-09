// User configuration questionnaire
// 用户配置问卷
import inquirer from 'inquirer'
import fs from 'fs'
import path from 'path'
import {lang} from '../../lang'
import chalk from 'chalk'
import ss from '../../utils/simpleSpinner'

const packageJsonFileFullName = 'package.json'
const packageJsonFilePath = path.join(process.cwd(), packageJsonFileFullName)
const packageJsonFile = fs.existsSync(packageJsonFilePath) ? require(packageJsonFilePath) : {}
// -----build config[BEGIN]-----
// -----问题配置[开始]-----
// local(project name,ssh)
// 本机配置（项目名，ssh相关）
const inquirerLocalConfig = [
    {
        type: 'input',
        name: 'projectName',
        message: () => lang('projectName'),
        default: () => {
            return packageJsonFile.name || 'unknown'
        }
    },
    {
        type: 'input',
        name: 'sshPrivateKeyPath',
        message: () => lang('sshPrivateKeyPath'),
        default: '~/.ssh/id_rsa'
    },
    {
        type: 'password',
        name: 'sshPassphrase',
        message: () => lang('sshPassphrase'),
    },
]
// environment
// 部署环境设置（有几种部署环境）
const inquirerDeployEnvTypesConfig = [
    {
        type: 'input',
        name: 'deployEnvTypes',
        message: () => lang('deployEnvTypes') + lang('[') + '"dev,test,prod" ' + lang('no space') + ']',
        default: 'dev',
        filter: (input: string) => {
            if (input) {
                input = input
                    .replace(/，/g, ',')
                    .replace(/ /g, '')
                    .replace(/,+/g, ',')
                if (input.lastIndexOf(',') === input.length - 1) {
                    input = input.substring(0, input.length - 1)
                }
                return input
            } else {
                return ''
            }
        }
    }
]
// project(build script)
// 项目信息设置（项目打包命令）
const inquirerProjectConfig = [
    {
        type: 'list',
        name: 'projectBuildScript',
        message: () => lang('projectBuildScript'),
        choices: () => {
            const choices = []
            if (packageJsonFile.scripts) {
                for (let key of Object.keys(packageJsonFile.scripts)) {
                    const value = packageJsonFile.scripts[key];
                    choices.push({
                        name:
                            chalk.magenta('"' + key + '"') +
                            chalk.yellow(':') +
                            chalk.green(' "' + value + '"'),
                        value: '[command]' + value
                    })
                }
            }
            choices.push({name: lang('skip') + ' (' + lang('skip build step') + ')', value: ''})
            choices.push({name: lang('custom') + ' (' + lang('type by myself') + ')', value: '[custom]'})
            return choices;
        }
    },
    {
        type: 'input',
        name: 'projectBuildCustomScript',
        message: () => lang('projectBuildCustomScript'),
        when: (answer: any) => !answer.projectBuildScript.indexOf('[custom]')
    }
]
// server(host, port, username, password)
// 服务器信息设置（Host，Port，用户名，密码）
const inquirerServerConfig = [
    {
        type: 'input',
        name: 'serverHost',
        message: () => lang('serverHost'),
    },
    {
        type: 'number',
        name: 'serverPort',
        message: () => lang('serverPort'),
        default: 22,
        validate: (input: number) => {
            return !isNaN(input)
        }
    },
    {
        type: 'input',
        name: 'serverUsername',
        message: () => lang('serverUsername'),
        default: 'root',
    },
    {
        type: 'password',
        name: 'serverPassword',
        message: () => lang('serverPassword'),
    },
]
// deployment path(file copy mapping information)
// 部署路径设置（文件拷贝映射信息）
const inquirerFileMapConfig = [
    {
        type: 'confirm',
        name: 'isSingleProjectDistPath',
        message: () => lang('isSingleProjectDistPath'),
        default: true,
    },
    {
        type: 'editor',
        name: 'fileMap',
        message: () => lang('fileMap') + ' {"localPath":"serverPath"}',
        default: JSON.stringify({}),
        when: ((answer: any) => !answer.isSingleProjectDistPath),
        validate: (input: string) => {
            let result = true
            try {
                JSON.parse(input)
            } catch (e) {
                result = false;
            }
            if (!input.trimStart().startsWith('{')) {
                result = false;
            }
            return result
        }
    },
    {
        type: 'input',
        name: 'projectFileOrPath',
        message: () => lang('projectFileOrPath'),
        default: 'dist',
        when: ((answer: any) => answer.isSingleProjectDistPath),
        filter: ((input: string) => path.normalize(input))
    },
    {
        type: 'input',
        name: 'serverDeployPath',
        message: () => lang('serverDeployPath') + ' (' + lang('Absolute path') + '. ' + lang('At least two levels of directory') + ')',
        when: ((answer: any) => answer.isSingleProjectDistPath),
        validate: (input: string) => {
            return path.normalize(input).replace(/\\/g, '/').match(/^\/.+?\/.+?/) !== null
        },
        default: '/example1/example2',
        filter: ((input: string) => path.normalize(input).replace(/\\/g, '/'))
    },

]
// other
// 其他设置
const inquirerOtherConfig = [
    {
        type: 'confirm',
        name: 'needRebuildWhenBuildScriptSameWithPreviousEnv',
        message: () => lang('needRebuildWhenBuildScriptSameWithPreviousEnv'),
        default: false,
    },
    {
        type: 'confirm',
        name: 'isClearServerPathBeforeDeploy',
        message: () => lang('isClearServerPathBeforeDeploy'),
        default: false,
    },
    {
        type: 'confirm',
        name: 'isClearLocalDistFileBeforeBuild',
        message: () => lang('isClearLocalDistFileBeforeBuild'),
        default: false,
    },
    {
        type: 'confirm',
        name: 'isClearLocalDistFileAfterDeploy',
        message: () => lang('isClearLocalDistFileAfterDeploy'),
        default: false,
    }
]
// -----build config[END]-----
// -----问题配置[结束]-----
export default async () => {
    const local = await inquirer.prompt(inquirerLocalConfig);
    const env: { [envKey: string]: DeployConfigEnv } = {}
    const deployEnvTypesConfig = await inquirer.prompt(inquirerDeployEnvTypesConfig)
    for (const key of deployEnvTypesConfig.deployEnvTypes.split(',').filter((item: string) => item)) {
        // 输出当前配置环境提示 dev/test/prod
        ss.info(chalk.blue(lang('Environment Configuration')) + chalk.yellow(": ") + chalk.cyan(key))
        // 开始环境配置
        const currentEnv: DeployConfigEnv = {
            project: {
                projectBuildScript: ""
            },
            fileMap: {},
            server: {
                serverHost: "",
                serverPort: 0,
                serverUsername: ""
            },
            other: {
                needRebuildWhenBuildScriptSameWithPreviousEnv: false,
                isClearLocalDistFileBeforeBuild: false,
                isClearLocalDistFileAfterDeploy: false,
                isClearServerPathBeforeDeploy: false
            }
        };
        {//.project
            let projectConfig = await inquirer.prompt(inquirerProjectConfig)
            if (projectConfig.projectBuildScript) {
                if (projectConfig.projectBuildScript.indexOf('[custom]')) {
                    projectConfig = projectConfig.projectBuildScript.replace('[command]', '')
                } else {
                    projectConfig = projectConfig.projectBuildCustomScript.replace('[custom]', '')
                }
            }
            currentEnv.project = {projectBuildScript: projectConfig};
        }
        {//.server
            currentEnv.server = await inquirer.prompt(inquirerServerConfig)
        }
        {//.fileMap
            let fileMapConfig = await inquirer.prompt(inquirerFileMapConfig)
            if (fileMapConfig.isSingleProjectDistPath) {
                fileMapConfig = {[fileMapConfig.projectFileOrPath]: fileMapConfig.serverDeployPath}
            }
            currentEnv.fileMap = fileMapConfig;
        }
        {//.other
            currentEnv.other = await inquirer.prompt(inquirerOtherConfig)
        }
        env[key] = currentEnv
    }
    const deployConfig: DeployConfig = {
        local: local,
        env: env
    }
    return deployConfig
}

