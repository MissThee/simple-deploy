import fs from 'fs'
import path from "path";
import {configFileExt} from "../../utils/global";
// use json to create a file
// json创建文件
export default async (configFileFullPath: string, jsonObj: DeployConfig) => {
    let jsonStr = JSON.stringify(jsonObj, null, '\t')
    switch (path.extname(configFileFullPath)) {
        case configFileExt.JS:
            jsonStr= 'module.exports = ' + jsonStr
            break
        case configFileExt.JSON:
            break
    }
    return await fs.promises.writeFile(configFileFullPath, jsonStr, 'utf8')
}
