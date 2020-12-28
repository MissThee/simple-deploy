const fs = require('fs')

const createConfigFile = (configFilePath: string, jsonObj: DeployConfig) => {
    const str = JSON.stringify(jsonObj, null, '\t')
    return fs.promises.writeFile(configFilePath, str, 'utf8')
}

export default async (configFilePath: string, jsonObj: DeployConfig) => {
    await createConfigFile(configFilePath, jsonObj)
}
