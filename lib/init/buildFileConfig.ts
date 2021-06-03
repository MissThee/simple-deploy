// 用户配置填写内容设置
import inquirer from 'inquirer'
import {lang} from '../../lang'
import {configFileExt} from '../../utils/global'

// -----问题配置[开始]-----
// 项目信息设置（项目打包命令）
const fileTypeConfig = [
    {
        type: 'list',
        name: 'type',
        message: () => lang('exportConfigFileType'),
        choices: () => {
            return [
                {name: 'js', value: configFileExt.JS},
                {name: 'json', value: configFileExt.JSON},
            ];
        }
    },
]
// -----问题配置[结束]-----
export default async () => {
    return {...await inquirer.prompt(fileTypeConfig)};
}
