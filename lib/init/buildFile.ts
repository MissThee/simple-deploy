const fs = require('fs')

export default async (configFilePath: string, jsonObj: DeployConfig) => {
    const str = JSON.stringify(jsonObj, null, '\t')
    return await fs.promises.writeFile(configFilePath, str, 'utf8')
}
