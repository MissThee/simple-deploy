import chalk from "chalk";
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __dirnameNew = path.dirname(fileURLToPath(import.meta.url));
export default async () => {
    async function getLocalPackage() {
        return JSON.parse(fs.readFileSync(path.resolve(__dirnameNew, '../package.json'), 'utf8')); // 从 package 中获取版本
    }
    function getServerVersion(name) {
        return new Promise(async (resolve, reject) => {
            const https = await import('https');
            https.get(`https://registry.npmjs.org/${name}`, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    const latest = (JSON.parse(data)[`dist-tags`] || {}).latest; // 获取最新版本
                    resolve(latest);
                });
            }).on(`error`, (err) => {
                resolve(null);
            });
        });
    }
    const localPackage = await getLocalPackage();
    const packageName = localPackage.name;
    const packageVersion = localPackage.version;
    const getServerVersionRes = await getServerVersion(packageName);
    if (packageVersion === getServerVersionRes || !getServerVersionRes) {
        return '';
    }
    let line1 = 'Update available ' + packageVersion + ' → ' + chalk.green(getServerVersionRes);
    let line2 = 'Run ' + chalk.magenta('npm i ' + packageName + '@' + getServerVersionRes + ' -D') + ' to update';
    const lineLength = line1.length - line2.length;
    const spaceStr = ' '.repeat(Math.abs(lineLength / 2));
    if (lineLength > 0) {
        line2 = spaceStr + line2;
    }
    if (lineLength <= 0) {
        line1 = spaceStr + line1;
    }
    let longLength;
    let line1Origin = 'Update available ' + packageVersion + ' → ' + getServerVersionRes;
    let line2Origin = 'Run npm i ' + packageName + '@' + getServerVersionRes + ' -D to update';
    longLength = Math.max(line1Origin.length, line2Origin.length);
    const splitStr = '-'.repeat(longLength);
    return '\n' + chalk.yellow(splitStr) + '\n' + line1 + '\n' + line2 + '\n' + chalk.yellow(splitStr) + '\n';
};
