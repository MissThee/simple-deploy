import buildConfig from "./buildConfig";
import buildFile from './buildFile'
import {lang} from "../../lang";
import chalk from "chalk";
import fs, {promises as fsp} from 'fs';
import ss from '../../utils/simpleSpinner'

export default async (configFileOutputPath: string) => {
    try {
        await fsp.access(configFileOutputPath, fs.constants.F_OK)
        ss.warn(chalk.yellow(lang('The configuration file already exists, creating it again will overwrite the existing file') + chalk.yellow(": ") + chalk.underline.blueBright.bold(configFileOutputPath)))
    } catch (e) {

    }
    const config: DeployConfig = await buildConfig()
    ss.start('Generating configuration file')
    await buildFile(configFileOutputPath, config)
    ss.succeed(chalk.green.bold(lang('Generate configuration file')) + chalk.yellow(": ") + chalk.underline.blueBright.bold(configFileOutputPath))
}
