import {lang} from "../../lang";
import chalk from "chalk";
import {configFilePath} from "../../utils/global";
import path from 'path';
import ss from '../../utils/simpleSpinner'
import * as deployTool from './deployTool'
import processWatcher from "../init/processWatcher";

export default async (opts: any) => {
    const directly = opts.directly
    const envKeys: string[] = opts.environment
    processWatcher(() => {
        // 进程退出前清理临时文件目录
        deployTool.removeFileSync('Tmp Dir', deployTool.deployLocalTmpPath)
    })
    if (!envKeys) {
        console.log(chalk.bgRed.bold(' ' + lang('ERROR INFO') + ' '))
        console.log(lang("Empty environment option. "), lang("Use '-e' to specify"))
        return
    }
    try {
        // 检查配置文件（关键属性是否存在、属性值是否有明显错误）
        const configFile = await deployTool.getCorrectConfigFile(configFilePath, envKeys)
        if (!configFile) {
            return
        }

        // 部署确认
        {
            let deploymentInfo = ''
            deploymentInfo += '\n' + '· ' + chalk.blue(configFile.local.projectName)
            for (const envKey of envKeys) {
                deploymentInfo += '\n' + '· ' + chalk.magenta(envKey) + chalk.yellow(': ') + chalk.green(configFile.env[envKey].server.serverHost)
            }
            if (!directly) {
                if (!(await deployTool.confirmDeploy(deploymentInfo, envKeys)).confirm) {
                    return
                }
            }
        }
        ss.info(chalk.blue.bold('All Environment'))
        for (const currentEnvKey of envKeys) {
            let currentEnv = configFile.env[currentEnvKey]
            // 测试连接ssh
            await deployTool.sshCheck(
                currentEnv.server.serverHost,
                currentEnv.server.serverPort,
                currentEnv.server.serverUsername,
                configFile.local.sshPrivateKeyPath,
                configFile.local.sshPassphrase,
                currentEnv.server.serverPassword
            )
        }
        let isFirstEnv = true
        let previousProjectBuildScript = null
        // 遍历需要执行的环境配置
        for (const currentEnvKey of envKeys) {
            ss.info(chalk.blue('Current Environment'), ' ', chalk.magenta(currentEnvKey))
            const currentEnv = configFile.env[currentEnvKey]

            if (currentEnv.other?.isClearLocalDistFileBeforeBuild) {
                // 本地清理编译结果目录
                await deployTool.removeFile('Dist', ...Object.keys(currentEnv.fileMap))
            }
            // 判断是否需要执行构造过程
            if (isFirstEnv || currentEnv.other?.needRebuildWhenBuildScriptSameWithPreviousEnv || previousProjectBuildScript !== currentEnv.project.projectBuildScript) {
                // 本地执行打编译命令
                if (currentEnv.project?.projectBuildScript) {
                    await deployTool.buildCode(currentEnv.project.projectBuildScript)
                }
                // 本地执行归档命令
                for (let fileMapKey of Object.keys(currentEnv.fileMap)) {
                    let localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey)
                    // 创建临时目录
                    await deployTool.createDir(localZipFile)
                    await deployTool.buildZip(fileMapKey, localZipFile)
                }
            } else {
                ss.start('Build Code And Archive', ' ', chalk.gray('no need'), chalk.gray('(build script is same with previous env. can use [needRebuildWhenBuildScriptSameWithPreviousEnv=true] to force build)'))
                ss.succeed()
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
            if (currentEnv.other?.isClearServerPathBeforeDeploy) {
                // 远程清理目录
                await deployTool.sshRemoveFile(ssh, ...Object.values(currentEnv.fileMap))
            }
            // 本地文件上传到远程
            for (const fileMapKey of Object.keys(currentEnv.fileMap)) {
                const fileMapValue = path.normalize(currentEnv.fileMap[fileMapKey])
                const localZipFile = deployTool.getLocalZipFilePathByProjectPath(fileMapKey)
                const remoteZipFile = await deployTool.getRemoteZipFilePath(fileMapKey, fileMapValue)
                await deployTool.sshUploadFile(ssh, localZipFile, remoteZipFile)
            }
            // 远程解压文件
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
            // 断开ssh
            deployTool.sshDisconnect(ssh)
            if (currentEnv.other?.isClearLocalDistFileAfterDeploy) {
                // 本地清理编译后的文件
                await deployTool.removeFile('Dist', ...Object.keys(currentEnv.fileMap))
            }
            previousProjectBuildScript = currentEnv.project.projectBuildScript
            isFirstEnv = false
        }
        // 本地清理临时文件目录
        await deployTool.removeFile('Tmp Dir', deployTool.deployLocalTmpPath)
        console.log(chalk.bgGreen.bold(' ' + lang('ALL DONE') + ' '))
    } catch (e) {
        ss.fail()
        // 本地临时文件目录
        await deployTool.removeFile('Tmp Dir', deployTool.deployLocalTmpPath)
        console.log(chalk.bgRed.bold(' ' + lang('ERROR INFO') + ' '))
        console.log(e)
    } finally {

    }
}

