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
        [projectPath: string]: string
    }
}

declare interface DeployConfig {
    local: DeployConfigLocal
    env: {
        [envKey: string]: DeployConfigEnv
    }
}
