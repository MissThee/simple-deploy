declare interface DeployConfigLocal {
    projectName: string,
    sshPrivateKeyPath?: string,
    sshPassphrase?: string
}

declare interface DeployConfigEnv {
    project: {
        projectBuildScript: string
    },
    server: {
        serverHost: string,
        serverPort: number,
        serverUsername: string,
        serverPassword?: string
    },
    fileMap: {
        //projectFileOrPath:serverPath
        [projectFileOrPath: string]: string
    },
    other?: {
        needRebuildWhenBuildScriptSameWithPreviousEnv?: boolean,
        isClearLocalDistFileBeforeBuild?: boolean
        isClearServerPathBeforeDeploy?: boolean,
        isClearLocalDistFileAfterDeploy?: boolean
    }
}

declare interface DeployConfig {
    local: DeployConfigLocal
    env: {
        [envKey: string]: DeployConfigEnv
    }
}

declare interface FileConfig {
    type: '.json' | '.js'
}
