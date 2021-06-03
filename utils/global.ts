import path from 'path';

export const configFileName = 'simple-deploy.config'

export enum configFileExt {
    JSON = '.json',
    JS = '.js',
}

export const configFilePath = path.join(process.cwd(), configFileName)
