// 用户配置填写内容设置
import inquirer from 'inquirer'
import {lang} from '../../lang'
import {configFileExt} from '../../utils/global'
// -----build config[BEGIN]-----
// -----问题配置[开始]-----
// type of configuration file(js,json)
// 配置文件类型（js,json）
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
// -----build config[END]-----
// -----问题配置[结束]-----
export default async () => {
    return {...await inquirer.prompt(fileTypeConfig)};
}
