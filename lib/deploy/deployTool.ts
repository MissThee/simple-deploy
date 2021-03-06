import {lang} from "../../lang";
import chalk from "chalk";
import {NodeSSH} from 'node-ssh';
import path from 'path';
import fs, {promises as fsp} from 'fs';
import inquirer from 'inquirer'
import childProcess, {ExecException} from "child_process";
import archiver from 'archiver'
import os from "os";
import ss from '../../utils/simpleSpinner'
import {isSafePath} from "../../utils/tools";
import {configFileExt} from "../../utils/global";

export const deployLocalTmpPath = '.deployTmp' + '_' + Date.now()

// 确认是否部署提示
export const confirmDeploy = (param: string, envs: string[]) => {
    return Promise.resolve(inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: () => 'Confirm' + param + '\n' + lang('sure to deploy') + ' ' + chalk.magenta(envs.join(', ')) + ' ?',
        }
    ]))
}

// 检查配置文件
export const getCorrectConfigFile = async (configFilePath: string, envKeys: string[]): Promise<void | DeployConfig> => {
    ss.start('Check Configuration', ' ', chalk.magenta(configFilePath + '[.js/.json]'))
    //检查配置文件存在
    let configFileFullPath = null
    try {
        configFileFullPath = configFilePath + configFileExt.JS
        await fsp.access(configFileFullPath, fs.constants.F_OK)
    } catch (e) {
        configFileFullPath = null
    }
    if (!configFileFullPath) {
        try {
            configFileFullPath = configFilePath + configFileExt.JSON
            await fsp.access(configFileFullPath, fs.constants.F_OK)
        } catch (e) {
            configFileFullPath = null
        }
    }
    if (!configFileFullPath) {
        throw 'config file ' + chalk.magenta(configFilePath + configFileExt.JS) + ' or ' + chalk.magenta(configFilePath + configFileExt.JSON) + ' not exist'
    }
    ss.start('Check Configuration', ' ', chalk.magenta(configFileFullPath))
    // 获取配置文件
    const configFile: DeployConfig = require(configFileFullPath)
    // 收集检查的错误
    const errorParamArr: { param: string, reason: string }[] = []
    let isOk = true;
    for (const envKey of envKeys) {
        if (envKey in configFile.env) {
            const envNode = configFile.env[envKey]
            // 不再检查项目编译指令，允许为空
            // const projectNode = envNode.project
            // if (!projectNode?.projectBuildScript) {
            //     errorParamArr.push({
            //         param: 'env.' + envKey + 'project.projectBuildScript',
            //         reason: lang('not found or empty value')
            //     })
            //     isOk = false
            // }
            const serverNode = envNode.server
            if (!serverNode?.serverHost) {
                errorParamArr.push({
                    param: 'env.' + envKey + 'server.serverHost',
                    reason: lang('not found or empty value')
                })
                isOk = false
            }
            if (Object.prototype.toString.call(serverNode?.serverPort) !== '[object Number]') {
                errorParamArr.push({
                    param: 'env.' + envKey + 'server.serverPort',
                    reason: lang('not found or NaN')
                })
                isOk = false
            }
            if (!serverNode?.serverUsername) {
                errorParamArr.push({
                    param: 'env.' + envKey + 'server.serverUsername',
                    reason: lang('not found or empty value')
                })
                isOk = false
            }
            const fileMapNode = envNode.fileMap
            if (!fileMapNode) {
                errorParamArr.push({
                    param: 'env.' + envKey + 'fileMap',
                    reason: lang('not found or empty value')
                })
                isOk = false
            } else {
                for (const key of Object.keys(fileMapNode)) {
                    if (!key) {
                        errorParamArr.push({
                            param: 'env.' + envKey + 'fileMap',
                            reason: lang('empty key')
                        })
                        isOk = false
                        continue
                    }
                    if (path.normalize(fileMapNode[key]).replace(/\\/g, '/').match(/^\/.+?\/.+?/) === null) {
                        errorParamArr.push({
                            param: 'env.' + envKey + 'fileMap.' + key,
                            reason: lang('At least two levels of directories are required to use absolute paths')
                        })
                        isOk = false
                    }
                }
            }
        } else {
            errorParamArr.push({
                param: envKey,
                reason: lang('unknown env')
            })
            isOk = false
        }
    }
    if (!isOk) {
        throw errorParamArr.map(item => lang('Error Param') + ' ' + chalk.magenta(item.param) + ' ' + chalk.red(item.reason)).join('\r\n')
    }
    ss.succeed('Check Configuration', ' ', chalk.magenta(configFileFullPath))
    return configFile
}

// 执行打包脚本
export const buildCode = async (script: string) => {
    ss.start('Build Code', ' ', chalk.magenta(script))
    if (script.length === 0) {
        ss.succeed()
        return
    }
    await new Promise<void>((resolve, reject) => {
        childProcess.exec(
            script,
            {
                cwd: process.cwd(),
                maxBuffer: 5000 * 1024
            },
            (error: ExecException | null, stdout: string, stderr: string) => {
                if (error) {
                    reject(error)
                } else {
                    ss.succeed()
                    resolve()
                }
            }
        )
    })
}

// 使用fileMap的key生成本地zip文件全名
export const getLocalZipFilePathByProjectPath = (projectPath: string) => {
    return path.join(process.cwd(), deployLocalTmpPath, path.basename(projectPath) + '_deploy.zip')
}

// 获取远程zip文件全路径
export const getRemoteZipFilePath = async (projectPath: string, remotePath: string) => {
    const localZipFile = getLocalZipFilePathByProjectPath(projectPath)
    //原文件是文件，且目标目录不以/结尾，直接拷贝目标目录
    if ((await fsp.stat(path.join(process.cwd(), projectPath))).isFile() && !remotePath.replace(/\\/g, '/').endsWith('/')) {
        return path.join(remotePath.substring(0, remotePath.lastIndexOf(path.basename(remotePath))), path.basename(localZipFile))
    } else {
        return path.join(remotePath, path.basename(localZipFile))
    }
}

// 递归创建目录
export const mkdirsSync = (dirname: string) => {
    if (dirname === '' || fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

// 创建临时存储目录
export const createDir = async (filePath: string) => {
    let dirPath = filePath.substring(0, filePath.lastIndexOf(path.basename(filePath)))
    if (fs.existsSync(dirPath)) {
        return
    }
    ss.start('LOCAL Create Dir', ' ', chalk.magenta(dirPath))
    await mkdirsSync(dirPath)
    ss.succeed()
}

// 归档Zip
export const buildZip = async (sourcePath: string, outputFile: string) => {
    sourcePath = path.join(process.cwd(), sourcePath)
    ss.start('LOCAL Zip File', ' ', chalk.magenta(sourcePath))
    const archive = archiver('zip', {
        zlib: {level: 9},
        forceLocalTime: true
    })
    const sourcePathStat = await fsp.stat(sourcePath)
    if (sourcePathStat.isFile()) {
        archive.file(sourcePath, {name: path.basename(sourcePath)})
    } else if (sourcePathStat.isDirectory()) {
        archive.directory(sourcePath, false)
    } else {
        throw lang('unknown file type') + ': ' + sourcePath
    }
    archive.pipe(fs.createWriteStream(outputFile))
    await archive.finalize()
    ss.succeedAppend(" ", chalk.yellow(lang('to')), ' ', chalk.magenta(path.normalize(outputFile)))
}
// 删除本地文件
export const removeFile = async (message: string, ...localPaths: string[]) => {
    let isFileExist = false
    for (const localPath of localPaths) {
        if (fs.existsSync(localPath)) {
            isFileExist = true
            break;
        }
    }
    if (!isFileExist) {
        return
    }
    ss.start('LOCAL Delete File', ' ', message)
    for (const localPath of localPaths) {
        await fsp.rm(path.join(process.cwd(), localPath), {recursive: true, force: true})
    }
    ss.succeedAppend(' ', chalk.magenta(localPaths.map(localPath => path.normalize(path.join(process.cwd(), localPath))).join(' , ')))
}
// 删除本地文件，同步，线程退出时清理使用
export const removeFileSync = (message: string, ...localPaths: string[]) => {
    let isFileExist = false
    for (const localPath of localPaths) {
        if (fs.existsSync(localPath)) {
            isFileExist = true
            break;
        }
    }
    if (!isFileExist) {
        return
    }
    for (const localPath of localPaths) {
        fs.rm(path.join(process.cwd(), localPath), {recursive: true, force: true}, () => {
        })
    }
    console.log(' ' + chalk.bgGray('CLEAR UP') + ' ')
}

// 测试ssh连通
export const sshCheck = async (host: string, port: number, username: string, privateKey?: string, passphrase?: string, password?: string) => {
    if (privateKey && privateKey.trimStart().startsWith('~')) {
        privateKey = path.join(os.homedir(), privateKey.substring(privateKey.indexOf('~') + 1))
    }
    let sshConfig = {
        host: host,
        port: port,
        username: username,
        password: password,
        privateKey: privateKey,
        passphrase: passphrase,
        tryKeyboard: true,
    }
    if (!privateKey && !password) {
        const answers = await inquirer.prompt([
            {
                type: 'password',
                name: 'password',
                message: lang('please input server password')
            }
        ])
        sshConfig.password = answers.password
    }
    !password && delete sshConfig.password
    !privateKey && delete sshConfig.privateKey
    !passphrase && delete sshConfig.passphrase
    const ssh = new NodeSSH()
    ss.start('SSH Test', ' ', chalk.magenta(host))
    await ssh.connect(sshConfig)
    await ssh.dispose()
    ss.succeed()
    return ssh
}

// 连接ssh
export const sshConnect = async (host: string, port: number, username: string, privateKey?: string, passphrase?: string, password?: string) => {
    if (privateKey && privateKey.trimStart().startsWith('~')) {
        privateKey = path.join(os.homedir(), privateKey.substring(privateKey.indexOf('~') + 1))
    }
    let sshConfig = {
        host: host,
        port: port,
        username: username,
        password: password,
        privateKey: privateKey,
        passphrase: passphrase,
        tryKeyboard: true,
    }
    if (!privateKey && !password) {
        const answers = await inquirer.prompt([
            {
                type: 'password',
                name: 'password',
                message: lang('please input server password')
            }
        ])
        sshConfig.password = answers.password
    }
    !password && delete sshConfig.password
    !privateKey && delete sshConfig.privateKey
    !passphrase && delete sshConfig.passphrase
    const ssh = new NodeSSH()
    ss.start('SSH Connect', ' ', chalk.magenta(host))
    await ssh.connect(sshConfig)
    ss.succeed()
    return ssh
}
// 上传文件
export const sshUploadFile = async (ssh: NodeSSH, localZipFile: string, remoteFile: string) => {
    ss.start('REMOTE Upload File', ' ', chalk.magenta(localZipFile))
    await ssh.putFile(
        path.normalize(localZipFile),
        path.normalize(remoteFile),
        null,
        {
            concurrency: 1
        }
    )
    ss.succeedAppend(" ", chalk.yellow(lang('to')), ' ', chalk.magenta(path.normalize(remoteFile)))
}
// 删除远程文件
export const sshRemoveFile = async (ssh: NodeSSH, ...remotePaths: string[]) => {
    ss.start('REMOTE Clean File Or Path')
    for (const remotePath of remotePaths) {
        if (!isSafePath(remotePath)) {
            throw lang('danger path param')
        }
        await ssh.execCommand(`rm -rf ${remotePath}`)
    }
    ss.succeedAppend(' ', chalk.magenta(remotePaths.map(item => path.normalize(item)).join(' , ')))
}
// 解压远程文件
export const sshUnzipFile = async (ssh: NodeSSH, ...remoteFiles: string[]) => {
    for (let remoteFile of remoteFiles) {
        ss.start('REMOTE Unzip And Delete File', ' ', chalk.magenta(remoteFile))
        if (!remoteFile.endsWith('.zip')) {
            throw lang('not found zip file')
        }
        if (!isSafePath(remoteFile)) {
            throw lang('danger path param')
        }
        //执行linux命令前将路径转为 linux分隔符
        remoteFile = path.normalize(remoteFile).replace(/\\/g, '/')
        const remotePath = remoteFile.substring(0, remoteFile.lastIndexOf(path.basename(remoteFile)))
        const sshCommand = `unzip -o ${remoteFile} -d ${remotePath} && rm -f ${remoteFile}`
        const result = await ssh.execCommand(sshCommand)
        if (result.code) { //code === 0 is OK
            throw result.stderr
        }
        ss.succeed()
    }
}
// 远程单文件改名
const sshRenameFile = async (ssh: NodeSSH, remoteFile: string, newName: string) => {
    if (remoteFile.endsWith('/')) {
        throw lang('invalid file path') + ': ' + remoteFile
    }
    if (newName.indexOf('/') >= 0) {
        throw lang('invalid new file name') + ': ' + newName
    }
    if (!isSafePath(remoteFile)) {
        throw lang('danger path param')
    }
    //执行linux命令前将路径转为 linux分隔符
    remoteFile = path.normalize(remoteFile).replace(/\\/g, '/')
    const remotePath = remoteFile.substring(0, remoteFile.lastIndexOf(path.basename(remoteFile)))
    const newFile = path.join(remotePath, newName).replace(/\\/g, '/')
    const sshCommand = `mv ${remoteFile} ${newFile}`
    const result = await ssh.execCommand(sshCommand)
    if (result.code) { //code === 0 is OK
        throw result.stderr
    }
    return newFile
}

//远程文件改名
export const sshRenameFileByFullPath = async (ssh: NodeSSH, projectPath: string, remotePath: string) => {
    if ((await fsp.stat(path.join(process.cwd(), projectPath))).isFile() && !remotePath.replace(/\\/g, '/').endsWith('/')) {
        //使用远程文件全路径 和 本地文件全路径截取的最后一部分文件名拼接，找到未改名称的远程文件
        const remoteFileBeforeRename = path.join(
            remotePath.substring(0, remotePath.lastIndexOf(path.basename(remotePath))),
            path.basename(projectPath))
        const newName = path.basename(remotePath)
        // 判断名称是否一致，进行更改名称
        if (!remoteFileBeforeRename.endsWith(newName)) {
            ss.start('REMOTE Rename File', ' ', chalk.magenta(remoteFileBeforeRename))
            const newFile = await sshRenameFile(ssh, remoteFileBeforeRename, newName)
            ss.succeedAppend(" ", chalk.yellow(lang('to')), ' ', chalk.magenta(path.normalize(newFile)))
        }
    }
}

// 断开ssh
export const sshDisconnect = (ssh: NodeSSH) => {
    ss.start('SSH Disconnect')
    ssh.dispose()
    ss.succeed()
}

