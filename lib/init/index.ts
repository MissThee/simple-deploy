import buildConfig from "./buildConfig";
import buildFile from './buildFile'
import ora from "ora";
import lang from "../../lang";
import chalk from "chalk";
import fs from 'fs';

const init = (configFileOutputPath: string) => {
    if (fs.existsSync(configFileOutputPath)) {
        ora().warn(chalk.yellow(lang('The configuration file already exists, creating it again will overwrite the existing file') + chalk.yellow(": ") + chalk.underline.blueBright.bold(configFileOutputPath)))
    }
    buildConfig().then((config:DeployConfig) => {
        const spinner = ora('Generating configuration file').start()
        buildFile(configFileOutputPath, config).then(() => {
            spinner.succeed(lang(chalk.green.bold('Generate configuration file')) + chalk.yellow(": ") + chalk.underline.blueBright.bold(configFileOutputPath))
        })
    })
}

export default init
