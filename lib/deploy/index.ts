import ora from "ora";
import lang from "../../lang";
import chalk from "chalk";
import {configFilePath} from "../../global/param";
import {NodeSSH} from 'node-ssh';
import path from 'path';
import fs from 'fs';
import inquirer from 'inquirer'
import childProcess from "child_process";
import archiver from 'archiver'

const ssh = new NodeSSH()
const maxBuffer = 5000 * 1024


// 任务列表
let taskList
// 是否确认部署
const confirmDeploy = (message?: string) => {
    return inquirer.prompt([
        {
            type: 'confirm',
            name: 'confirm',
            message: message + ', ' + lang('continue') + '?'
        }
    ])
}

// 检查环境参数是否正确
const checkEnvParam = (config: DeployConfig, envKey: string) => {
    const spinner = ora(lang('Checking')).start()
    if (envKey in config.env) {
        const currentEnv = config.env[envKey]
    } else {
        spinner.fail('[' + envKey + '] not exist in ' + configFilePath)
        process.exit(1)
    }
    spinner.succeed(lang('Checking') + ' ' + lang('Done'))
}

// 执行打包脚本
const buildCode = async (script: string) => {
    const spinner = ora(lang('Packing')).start()
    try {
        await new Promise<void>((resolve, reject) => {
            childProcess.exec(
                script,
                {
                    cwd: process.cwd(),
                    maxBuffer: maxBuffer
                },
            ).on("error", err => { //命令本身报错，创建子进程报错
                spinner.fail(lang('Packing') + '' + lang('Error'))
                spinner.fail(err.message)
                process.exit(1)
            }).on("exit", (code, signal) => {
                spinner.succeed(lang('Packing') + '' + lang('Done'))
                resolve()
            }).stderr?.on('data', (data) => { //命令运行中报错
                console.log('Error msg from process 2: ' + data);
            })
        })
    } catch (e) {
        spinner.fail(lang('Packing') + ' ' + lang('Error'))
        spinner.fail(e.message)
        process.exit(1)
    }
}

// 打包Zip
const buildZip = async (sourcePath: string, outputPath?: string) => {
    const spinner = ora(lang('Archiving')).start()
    sourcePath = path.normalize(sourcePath)
    if (!outputPath) {
        outputPath = sourcePath
        const basename = path.basename(outputPath)
        const prePath = outputPath.substring(0, outputPath.indexOf(basename))
        outputPath = path.join(prePath, 'deployTmp', basename)
    }
    outputPath = path.normalize(outputPath)
    const output = fs
        .createWriteStream(path.join(process.cwd(), outputPath + '.zip'))
        .on('error', (err) => {
            spinner.fail(lang('Archiving') + ' ' + lang('Error'))
            spinner.fail(err.message)
            process.exit(1)
        })
    const archive = archiver('zip', {
        zlib: {level: 9}
    })
    archive.on('error', (e) => {
        spinner.fail(lang('Archiving') + ' ' + lang('Error'))
        spinner.fail(e.message)
        process.exit(1)
    })

    archive.pipe(output)
    archive.directory(sourcePath, false)
    await archive.finalize()
    spinner.succeed(lang('Archiving') + ' ' + lang('Done'))

}

// 连接ssh
const connectSSH = async (host: string, port: number, username: string, privateKey?: string, passphrase?: string, password?: string) => {
    const spinner = ora(lang('SSH Connecting')).start()
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
        // if (!privateKey && !password) {
        //     const answers = await inquirer.prompt([
        //         {
        //             type: 'password',
        //             name: 'password',
        //             message: lang('please input password')
        //         }
        //     ])
        //     sshConfig.password = answers.password
        // }
        //
        // !privateKey && delete sshConfig.privateKey
        // !passphrase && delete sshConfig.passphrase

        await ssh.connect(sshConfig)
        spinner.succeed(lang('SSH Connecting') + ' ' + lang('Done'))
    } catch (e) {
        spinner.fail(lang('SSH Connecting') + ' ' + lang('Error'))
        spinner.fail(e.message)
        process.exit(1)
    }
}

// 上传本地文件
const uploadLocalFile = async (localPath: string, remotePath: string) => {
    const spinner = ora(lang('Uploading')).start()
    try {
        localPath = path.join(process.cwd(), localPath)
        await ssh.putFile(
            localPath,
            remotePath,
            null,
            {
                concurrency: 1
            }
        )
        spinner.succeed(lang('Uploading') + ' ' + lang('Done'))
    } catch (e) {
        spinner.fail(lang('Uploading') + ' ' + lang('Error'))
        spinner.fail(e.message)
        process.exit(1)
    }
}

// 删除远程文件
const removeRemoteFile = async (remotePath: string) => {
    const spinner = ora(lang('Cleaning')).start()
    try {
        await ssh.execCommand('rm -rf ' + remotePath)
        spinner.succeed(lang('Cleaning') + ' ' + lang('Done'))
    } catch (e) {
        spinner.fail(lang('Cleaning') + ' ' + lang('Error'))
        spinner.fail(e.message)
        process.exit(1)
    }
}

// 解压远程文件
const unzipRemoteFile = async (remotePath: string) => {
    const spinner = ora(lang('Unpacking')).start()
    try {
        const remoteFileName = remotePath
        await ssh.execCommand(
            `unzip -o ${remotePath} -d ${remotePath} && rm -rf ${remotePath}`
        )
        spinner.succeed(lang('Unpacking') + ' ' + lang('Done'))
    } catch (e) {
        spinner.fail(lang('Cleaning') + ' ' + lang('Error'))
        spinner.fail(e.message)
        process.exit(1)
    }
}

// 删除本地打包文件
const removeLocalFile = (localPath: string) => {
    const spinner = ora(lang('Deleting')).start()
    localPath = path.join(process.cwd(), localPath)
    const remove = (path: string) => {
        if (fs.existsSync(path)) {
            fs.readdirSync(path).forEach((file) => {
                let currentPath = `${path}/${file}`
                if (fs.statSync(currentPath).isDirectory()) {
                    remove(currentPath)
                } else {
                    fs.unlinkSync(currentPath)
                }
            })
            fs.rmdirSync(path)
        }
    }

    remove(localPath)
    fs.unlinkSync(`${localPath}.zip`)
    spinner.succeed()
}

// 断开ssh
const disconnectSSH = () => {
    ssh.dispose()
}

const deploy = async (param: string[]) => {
    //检查配置文件存在
    if (!fs.existsSync(configFilePath)) {
        ora().fail(lang('deploy configuration not exist'))
        process.exit(1)
    }
    //部署动作确认
    if (!(await confirmDeploy()).confirm) {
        return
    }
    // 获取配置文件
    const configFile: DeployConfig = require(configFilePath)
    for (const envKey of param) {
        let currentEnv = configFile.env[envKey]
        //执行打包命令
        await buildCode(currentEnv.project.projectBuildScript)
        //
        for (const localPath of Object.keys(currentEnv.fileMap)) {
            buildZip(localPath)
        }
    }
    await confirmDeploy();
}

export default deploy
