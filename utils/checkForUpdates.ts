import path from "path";
import chalk from "chalk";

export default async () => {
    function getLocalPackage() { // 从本地获取版本号
        return require(path.resolve(__dirname, `../package.json`)) // 从 package 中获取版本
    }

    function getServerVersion(name: string) { // 从 npmjs 中获取版本号
        return new Promise((resolve, reject) => {
            const https = require('https');
            https.get(`https://registry.npmjs.org/${name}`, (res: { on: (arg0: string, arg1: (chunk: string) => void) => void }) => {
                let data = ''
                res.on('data', (chunk: string) => {
                    data += chunk
                })
                res.on('end', () => {
                    const latest = (JSON.parse(data)[`dist-tags`] || {}).latest // 获取最新版本
                    resolve(latest)
                })
            }).on(`error`, (err: { message: string | undefined }) => {
                throw new Error(err.message)
            })
        })
    }

    const localPackage = getLocalPackage()
    const packageName = localPackage.name
    const packageVersion = localPackage.version
    const getServerVersionRes = await getServerVersion(packageName)
    if (packageVersion == getServerVersionRes) {
        return
    }

    let line1 = 'Update available ' + getServerVersionRes + ' → ' + chalk.green(packageVersion)
    let line2 = 'Run ' + chalk.magenta('npm i ' + packageName + ' -D') + ' to update'
    const lineLength = line1.length - line2.length
    let spaceStr = ''
    let i = 0
    while (i < Math.abs(lineLength / 2)) {
        spaceStr += ' '
        i++
    }
    if (lineLength > 0) {
        line2 = spaceStr + line2
    }
    if (lineLength <= 0) {
        line1 = spaceStr + line1
    }
    let longLength: number
    let line1Origin = 'Update available ' + getServerVersionRes + ' → ' + packageVersion
    let line2Origin = 'Run npm i ' + packageName + ' -D to update'
    longLength = Math.max(line1Origin.length, line2Origin.length)
    let splitStr = ''
    for (let i = 0; i < longLength; i++) {
        splitStr += '-'
    }
    console.info(chalk.yellow(splitStr))
    console.info(line1)
    console.info(line2)
    console.info(chalk.yellow(splitStr))
}