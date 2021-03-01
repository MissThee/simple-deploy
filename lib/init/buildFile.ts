const fs = require('fs')
// json对象 创建文件
export default async (configFilePath: string, jsonObj: DeployConfig) => {
    const str = JSON.stringify(jsonObj, null, '\t')
    return await fs.promises.writeFile(configFilePath, str, 'utf8')
}
