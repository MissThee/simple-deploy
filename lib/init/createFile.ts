import fs from 'fs'
import path from "path";
import {configFileExt} from "../../utils/global.js";
// use json to create a file
// json创建文件
export default async (configFileFullPath: string, jsonObj: DeployConfig) => {
    const jsonStr = JSON.stringify(jsonObj, null, '\t')
    let res = ''
    switch (path.extname(configFileFullPath)) {
        case configFileExt.JS:
            if (JSON.parse(fs.readFileSync('./package.json', 'utf8')).type === "module") {
                res = 'export default ' + jsonStr
            } else {
                res = 'module.exports = ' + jsonStr
            }
            break
        case configFileExt.JSON:
            res = jsonStr
            break
    }
    return await fs.promises.writeFile(configFileFullPath, res, 'utf8')
}
