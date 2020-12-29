import ora from "ora";
import lang from "../../lang";
import chalk from "chalk";
import {configFilePath} from "../../utils/global";
import {NodeSSH} from 'node-ssh';
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer'
import childProcess from "child_process";
import archiver from 'archiver'
import os from "os";

const ssh = new NodeSSH()
const maxBuffer = 5000 * 1024
const currentTimestamp = '_' + Date.now()
const deployLocalTmpPath = '.deployTmp' + currentTimestamp
let zipFileIndex = 0

class SimpleSpinner {
    spinner = ora()

    start(...value: string[]) {
        this.spinner.start(value.map(item => lang(item)).join(''))
    }

    succeed(...value: string[]) {
        this.spinner.succeed(value.map(item => lang(item)).join(''))
    }

    fail(err: any, ...value: string[]) {
        this.spinner.fail(value.map(item => lang(item)).join(''))
        console.log('' + err)
    }

    info(...value: string[]) {
        this.spinner.info(value.map(item => lang(item)).join(''))
    }
}

const ss = new SimpleSpinner()

// 是否确认部署
const confirmDeployTask = (param: string[]) => {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: lang('sure to deploy') + ' ' + chalk.magenta.bold(param.join(',')) + ' ?',
        }
    ])
}
const getCorrectConfigFileTask = async (configFilePath: string, envKeys: string[]) => {
    ss.start('Check Configuration', ' ', chalk.magenta(configFilePath))
    //检查配置文件存在
    if (!fs.existsSync(configFilePath)) {
        ss.fail('deploy configuration not exist')
        return
    }
    // 获取配置文件
    const configFile: DeployConfig = require(configFilePath)
    // 检查启动参数中的环境参数是否在配置文件中出现
    const errorParamArr: { param: string, reason: string }[] = []
    let isOk = true;
    for (const envKey of envKeys) {
        if (envKey in configFile.env) {
            const envNode = configFile.env[envKey]
            const projectNode = envNode.project
            if (!projectNode?.projectBuildScript) {
                errorParamArr.push({
                    param: 'env.' + envKey + 'project.projectBuildScript',
                    reason: lang('not found or empty value')
                })
                isOk = false
            }
            const serverNode = envNode.server
            if (!serverNode?.serverHost) {
                errorParamArr.push({
                    param: 'env.' + envKey + 'server.serverHost',
                    reason: lang('not found or empty value')
                })
                isOk = false
            }
            if (isNaN(serverNode?.serverPort)) {
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
                            reason: lang('Absolute path') + '. ' + lang('At least two levels of directory')
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
        errorParamArr.forEach(item => {
            ss.fail('Error Param', ' ', item.param, ' ', chalk.red(item.reason))
        })
        return;
    }
    await setTimeout(function () {
    }, 1000)
    ss.succeed()
    return configFile
}

// 执行打包脚本
const buildCodeTask = async (script: string) => {
    ss.start('Build Code', ' ', chalk.magenta(script))
    try {
        await new Promise<void>((resolve, reject) => {
            childProcess.exec(
                script,
                {
                    cwd: process.cwd(),
                    maxBuffer: maxBuffer
                },
            ).on("error", err => { //命令本身报错，创建子进程报错
                ss.fail(err.message)
                process.exit()
            }).on("exit", (code, signal) => {
                ss.succeed()
                resolve()
            }).stderr?.on('data', (data) => { //命令运行中报错
                console.log('Error msg from process 2: ' + data);
            })
        })
    } catch (e) {
        ss.fail(e.toString())
        process.exit()
    }
}
// 使用fileMap的key生成本地zip文件全名
const getFilePathByProjectPath = (projectPath: string) => {
    return path.join(process.cwd(), deployLocalTmpPath, zipFileIndex++ + '_' + path.basename(projectPath) + '.zip')
}
// 归档Zip
const buildZipTask = async (sourcePath: string) => {
    ss.start('Zip Local File', ' ', chalk.magenta(sourcePath))
    const mkdirsSync = (dirname: string) => {// 递归创建目录
        if (dirname === '' || fs.existsSync(dirname)) {
            return true;
        } else {
            if (mkdirsSync(path.dirname(dirname))) {
                fs.mkdirSync(dirname);
                return true;
            }
        }
    }
    // 目录是否存在
    const outputPathAbsolute = path.join(process.cwd(), deployLocalTmpPath)
    if (!fs.existsSync(outputPathAbsolute)) {
        mkdirsSync(outputPathAbsolute)
    }
    let outputFile = getFilePathByProjectPath(sourcePath)
    const archive = archiver('zip', {
        zlib: {level: 9}
    })

    const sourcePathStat = fs.statSync(sourcePath)
    if (sourcePathStat.isFile()) {
        archive.file(sourcePath, {name: path.basename(sourcePath)})
    } else if (sourcePathStat.isDirectory()) {
        archive.directory(sourcePath, false)
    } else {
        ss.fail(lang('unknown file type') + ': ' + sourcePath)
        process.exit()
    }
    archive.pipe(fs.createWriteStream(outputFile))
    await archive.finalize()
    ss.succeed()
    return outputFile;
}

// 连接ssh
const connectSSHTask = async (host: string, port: number, username: string, privateKey?: string, passphrase?: string, password?: string) => {
    ss.start('SSH Connect', ' ', chalk.magenta(host))
    if (privateKey && privateKey.trimStart().startsWith('~')) {
        privateKey = path.join(os.homedir(), privateKey.substring(privateKey.indexOf('~') + 1))
    }
    try {
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
                    message: lang('please input password')
                }
            ])
            sshConfig.password = answers.password
        }
        !password && delete sshConfig.password
        !privateKey && delete sshConfig.privateKey
        !passphrase && delete sshConfig.passphrase
        // !privateKey && delete sshConfig.privateKey
        // !passphrase && delete sshConfig.passphrase

        await ssh.connect(sshConfig)
        ss.succeed()
    } catch (e) {
        ss.fail(e.toString())
        process.exit()
    }
}

// 上传本地文件
const uploadLocalFileTask = async (localFile: string, remotePath: string) => {
    ss.start('Upload File', ' ', chalk.magenta(localFile))
    const remoteFile = path.join(remotePath, path.basename(localFile))
    try {
        await ssh.putFile(
            localFile,
            remoteFile,
            null,
            {
                concurrency: 1
            }
        )
        ss.succeed()
        return remoteFile
    } catch (e) {
        ss.fail(e.toString())
        process.exit()
    }
}

// 删除远程文件
const removeRemoteFileTask = async (remotePath: string) => {
    ss.start('Clean')
    try {
        await ssh.execCommand('rm -rf ' + remotePath)
        ss.succeed()
    } catch (e) {
        ss.fail(e.toString())
        process.exit()
    }
}

// 解压远程文件
const unzipRemoteFile = async (remoteFile: string) => {
    ss.start('Unzip Remote File', ' ', chalk.magenta(remoteFile))
    if (!remoteFile.endsWith('.zip')) {
        ss.fail(lang('not found zip file'))
        process.exit()
    }
    if (path.normalize(remoteFile).replace(/\\/g, '/').match(/^\/.+?\/.+?/) === null) {
        ss.fail(lang('danger path param'))
        process.exit()
    }
    //执行linux命令前将路径转为 linux分隔符
    remoteFile = path.normalize(remoteFile).replace(/\\/g, '/')
    const remotePath = remoteFile.substring(0, remoteFile.lastIndexOf(path.basename(remoteFile)))
    try {
        const sshCommand = `unzip -o ${remoteFile} -d ${remotePath} && rm -rf ${remoteFile}`
        const result = await ssh.execCommand(sshCommand)
        if (result.code) {
            ss.fail(result.stderr)
            process.exit()
        }
        ss.succeed()
    } catch (e) {
        ss.fail(e.toString())
        process.exit()
    }
}

// 删除本地打包文件
const removeLocalFile = (localPath: string) => {
    localPath = path.join(process.cwd(), localPath)
    ss.start('Clean Local Tmp', ' ', chalk.magenta(localPath))
    return new Promise<void>((resolve, reject) => {
        fs.rm(localPath, {recursive: true, force: true}, (err) => {
            if (err) {
                ss.fail(err.message)
                process.exit()
            } else {
                ss.succeed()
                resolve()
            }
        })
    })

}

// 断开ssh
const disconnectSSH = () => {
    ss.start('SSH Disconnect')
    ssh.dispose()
    ss.succeed()
}

const deploy = async (param: string[]) => {
    try {
        // 部署确认
        if (!(await confirmDeployTask(param)).confirm) {
            return
        }
        // 检查配置文件
        const configFile = await getCorrectConfigFileTask(configFilePath, param)
        if (!configFile) {
            return
        }
        for (const envKey of param) {
            ss.info(chalk.bgBlue.bold(' ' + envKey + ' '))
            let currentEnv = configFile.env[envKey]
            // 执行打包命令
            await buildCodeTask(currentEnv.project.projectBuildScript)
            // 执行归档命令
            const zipTmpFileMap: { [projectPath: string]: string } = {}
            for (const projectPath of Object.keys(currentEnv.fileMap)) {
                zipTmpFileMap[projectPath] = await buildZipTask(projectPath)
            }
            //连接ssh
            await connectSSHTask(
                currentEnv.server.serverHost,
                currentEnv.server.serverPort,
                currentEnv.server.serverUsername,
                configFile.local.sshPrivateKeyPath,
                configFile.local.sshPassphrase,
                currentEnv.server.serverPassword
            )
            const remoteZipFileArr = []
            //上传文件
            for (const projectPath of Object.keys(currentEnv.fileMap)) {
                remoteZipFileArr.push(await uploadLocalFileTask(zipTmpFileMap[projectPath], currentEnv.fileMap[projectPath]))
            }
            //解压远程文件
            for (const remoteZipFile of remoteZipFileArr) {
                await unzipRemoteFile(remoteZipFile)
            }
        }
        disconnectSSH()
        //删除本地临时文件
        await removeLocalFile(deployLocalTmpPath)
        ss.succeed(chalk.bgGreen.bold(lang('All Done')))
    } catch (e) {
        ss.fail(e)
        //删除本地临时文件
        await removeLocalFile(deployLocalTmpPath)
    }
    process.exit()
}

export default deploy
