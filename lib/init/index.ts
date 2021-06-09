import buildDeployConfig from "./buildDeployConfig";
import buildFileConfig from "./buildFileConfig";
import createFile from './createFile'
import {lang} from "../../lang";
import chalk from "chalk";
import fs, {promises as fsp} from 'fs';
import ss from '../../utils/simpleSpinner'

export default async (configFileOutputPath: string) => {
    // select the generated file type
    // 选择生成文件类型
    const fileConfig: FileConfig = await buildFileConfig()
    const configFileOutputFillPath = configFileOutputPath + fileConfig.type
    try {
        // Check if the configuration file exists.If it already exists, print a prompt, and create it again will overwrite
        // 检查配置文件是否存在。若已存在，打印提示，再次创建会覆盖
        await fsp.access(configFileOutputFillPath, fs.constants.F_OK)
        ss.warn(chalk.yellow(lang('The configuration file already exists, creating it again will overwrite the existing file') + chalk.yellow(": ") + chalk.underline.blueBright.bold(configFileOutputFillPath)))
    } catch (e) {}
    // get user configuration value
    // 获取用户配置值
    const deployConfig: DeployConfig = await buildDeployConfig()

    ss.start('Generating configuration file')
    // generate configuration files from user configuration values
    // 将用户配置值生成配置文件
    await createFile(configFileOutputFillPath, deployConfig)
    ss.succeed(chalk.green.bold(lang('Generate configuration file')) + chalk.yellow(": ") + chalk.underline.blueBright.bold(configFileOutputFillPath))
}
