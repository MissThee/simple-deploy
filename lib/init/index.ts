import buildConfig from "./buildConfig";
import buildFile from './buildFile'
import {lang} from "../../lang";
import chalk from "chalk";
import fs, {promises as fsp} from 'fs';
import ss from '../../utils/simpleSpinner'

export default async (configFileOutputPath: string) => {
    try {
        //检查配置文件是否存在。已存在，提示存在，再次创建会覆盖；不存在，抛出异常跳过提示
        await fsp.access(configFileOutputPath, fs.constants.F_OK)
        ss.warn(chalk.yellow(lang('The configuration file already exists, creating it again will overwrite the existing file') + chalk.yellow(": ") + chalk.underline.blueBright.bold(configFileOutputPath)))
    } catch (e) {

    }
    // 调用问答方法，获取用户配置值
    const config: DeployConfig = await buildConfig()
    ss.start('Generating configuration file')
    // 将用户配置值生成配置文件
    await buildFile(configFileOutputPath, config)
    ss.succeed(chalk.green.bold(lang('Generate configuration file')) + chalk.yellow(": ") + chalk.underline.blueBright.bold(configFileOutputPath))
}
