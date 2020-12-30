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
        isClearServerPathBeforeDeploy?: boolean,
        isClearDistFileAfterDeploy?: boolean
    }
}

declare interface DeployConfig {
    local: DeployConfigLocal
    env: {
        [envKey: string]: DeployConfigEnv
    }
}
