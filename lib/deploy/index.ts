import {lang} from "../../lang";
import chalk from "chalk";
import {configFilePath} from "../../utils/global";
import path from 'path';
import ss from '../../utils/simpleSpinner'

import * as deployTool from './deployTool'

export default async (env: string[]) => {
    if (!env) {
        console.log(chalk.bgRed.bold(' ' + lang('ERROR INFO') + ' '))
        console.log(lang("Empty environment option. "), lang("Use '-e' to specify"))
        return
    }
    // 部署确认
    if (!(await deployTool.confirmDeploy(env)).confirm) {
        return
    }
    try {
        // 检查配置文件（关键属性是否存在、属性值是否有明显错误）
        const configFile = await deployTool.getCorrectConfigFile(configFilePath, env)
        if (!configFile) {
            return
        }
        // 遍历需要执行的环境配置
        for (const currentEnvKey of env) {
            ss.info('Current Environment', ' ', chalk.blue.bold(currentEnvKey))
            let currentEnv = configFile.env[currentEnvKey]
            //清理编译目录
            if (currentEnv.other?.isClearLocalDistFileBeforeBuild) {
                await deployTool.removeFile('Dist', ...Object.keys(currentEnv.fileMap))
            }
            // 执行打包命令
            await deployTool.buildCode(currentEnv.project.projectBuildScript)
            // 执行归档命令
            for (let fileMapKey of Object.keys(currentEnv.fileMap)) {
                let localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey)
                // 创建临时目录
                await deployTool.createDir(localZipFile)
                await deployTool.buildZip(fileMapKey, localZipFile)
            }
            // 连接ssh
            const ssh = await deployTool.sshConnect(
                currentEnv.server.serverHost,
                currentEnv.server.serverPort,
                currentEnv.server.serverUsername,
                configFile.local.sshPrivateKeyPath,
                configFile.local.sshPassphrase,
                currentEnv.server.serverPassword
            )
            // 清理远程目录
            if (currentEnv.other?.isClearServerPathBeforeDeploy) {
                await deployTool.sshRemoveFile(ssh, ...Object.values(currentEnv.fileMap))
            }
            // 上传文件
            for (const fileMapKey of Object.keys(currentEnv.fileMap)) {
                const fileMapValue = path.normalize(currentEnv.fileMap[fileMapKey])
                const localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey)
                const remoteZipFile = await deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)
                await deployTool.sshUploadFile(ssh, localZipFile, remoteZipFile)
            }
            // 解压远程文件
            for (const fileMapKey of Object.keys(currentEnv.fileMap)) {
                const fileMapValue = path.normalize(currentEnv.fileMap[fileMapKey])
                const remoteZipFile = await deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)
                await deployTool.sshUnzipFile(ssh, remoteZipFile)
            }
            // 远程文件改名
            for (const fileMapKey of Object.keys(currentEnv.fileMap)) {
                const fileMapValue = path.normalize(currentEnv.fileMap[fileMapKey])
                await deployTool.sshRenameFileByFullPath(ssh, fileMapKey, fileMapValue)
            }
            //断开ssh
            deployTool.sshDisconnect(ssh)
            //清理编译后的文件
            if (currentEnv.other?.isClearLocalDistFileAfterDeploy) {
                await deployTool.removeFile('Dist', ...Object.keys(currentEnv.fileMap))
            }
        }
        // 清理临时文件目录
        await deployTool.removeFile('Tmp', deployTool.deployLocalTmpPath)
        console.log(chalk.bgGreen.bold(' ' + lang('ALL DONE') + ' '))
    } catch (e) {
        ss.fail()
        // 清理临时文件目录
        await deployTool.removeFile('Tmp', deployTool.deployLocalTmpPath)
        console.log(chalk.bgRed.bold(' ' + lang('ERROR INFO') + ' '))
        console.log(e)
    }
    process.exit()
}
