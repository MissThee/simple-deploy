![simple-deploy](https://socialify.git.ci/MissThee/simple-deploy/image?font=KoHo&forks=1&language=1&owner=1&pattern=Circuit%20Board&stargazers=1&theme=Light)
# simple-deploy

A simple NodeJS tool for packaging, copying to linux server, and cleaning up

### Install

```
npm i @missthee/simple-deploy -D
```

### Use

1. ***Initialization***
   ```shell
   # Initialize the configuration file.
   simple-deploy init
   ```
   or
   ```shell
   # chinese
   simple-deploy init -l zh-CN
   ```
   Generate configuration file `simple-deploy.config.json` after option.


2. ***Deployment***
   ```shell
   # Packaging, Copying to linux server, Cleaning up
   simple-deploy -e [environmentKey]
   ```
   Execution log example
   ```text
        √ Check Configuration T:\deployFileTest\simple-deploy.config.json
        ? Confirm
        · deploy-cli
        · dev: 11.22.33.44
        sure to deploy dev ? Yes
        i Current Environment dev
        √ Build Code echo
        √ Create Local Tmp Dir T:\deployFileTest\.deployTmp_1611289911528\
        √ Zip Local File T:\deployFileTest\dist to T:\deployFileTest\.deployTmp_1611289911528\dist_deploy.zip
        √ Zip Local File T:\deployFileTest\dist1\index.html to T:\deployFileTest\.deployTmp_1611289911528\index.html_deploy.zip
        √ SSH Connect 11.22.33.44
        √ Upload File T:\deployFileTest\.deployTmp_1611289911528\dist_deploy.zip to \www\wwwroot\default\aaa\dist_deploy.zip
        √ Upload File T:\deployFileTest\.deployTmp_1611289911528\index.html_deploy.zip to \www\wwwroot\default\bbb\index.html_deploy.zip
        √ Unzip And Delete Remote File \www\wwwroot\default\aaa\dist_deploy.zip
        √ Unzip And Delete Remote File \www\wwwroot\default\bbb\index.html_deploy.zip
        √ Rename Remote File \www\wwwroot\default\bbb\index.html to \www\wwwroot\default\bbb\ondex.html
        √ SSH Disconnect
        √ Clean Local Tmp Dir T:\deployFileTest\.deployTmp_1611289911528
        ALL DONE
   ```
   Deployment process
    + `Check Configuration` Check file attributes and content
    + `Build Code` Execute the set instructions
    + `Create Local Tmp` Create a temporary folder to store the zip file
    + `Zip Local File` Archive local files
    + `SSH Connect` Establish ssh link
    + `Upload File` Upload archived files
    + `Unzip And Delete Remote File` Unzip and delete the uploaded archived file
    + `Rename Remote File` If it is a single file, and the uploaded file name is specified in the fileMap, the file will be renamed
    + `SSH Disconnect` Disconnect ssh link
    + `Clean Local Tmp Dir` Clean up temporary folder

### Configuration File

+ `simple-deploy.config.json` example:
   ```json
      {
        "local": {
          "projectName": "deploy-cli",
          "sshPrivateKeyPath": "~/.ssh/id_rsa",
          "sshPassphrase": ""
        },
        "env": {
          "dev": {
            "project": {
              "projectBuildScript": "npm build"
            },
            "server": {
              "serverHost": "11.22.33.44",
              "serverPort": 22,
              "serverUsername": "root",
              "serverPassword": "root"
            },
            "fileMap": {
              "dist": "/www/wwwroot/default/aaa",
              "dist1/index.html": "/www/wwwroot/default/bbb/rename.html"
            },
            "other": {
              "needRebuildWhenBuildScriptSameWithPreviousEnv": false,
              "isClearLocalDistFileBeforeBuild": false,
              "isClearServerPathBeforeDeploy": false,
              "isClearLocalDistFileAfterDeploy": false
            }
          },
          "prod": {
            "project": {
              "projectBuildScript": "npm build"
            },
            "server": {
              "serverHost": "55.66.77.88",
              "serverPort": 22,
              "serverUsername": "root",
              "serverPassword": "root"
            },
            "fileMap": {
              "dist": "/www/wwwroot/default/aaa",
              "dist1/index.html": "/www/wwwroot/default/bbb/rename.html"
            },
            "other": {
              "needRebuildWhenBuildScriptSameWithPreviousEnv": false,
              "isClearLocalDistFileBeforeBuild": false,
              "isClearServerPathBeforeDeploy": false,
              "isClearLocalDistFileAfterDeploy": false
            }
          }
        }
      }
   ```
+ `other` option
    + `needRebuildWhenHasSameBuildScriptWithPreviousEnv`
      if buildScript in current env was same as previous env:`false` skip build; `true` run build script.
    + `isClearLocalDistFileBeforeBuild`
      Use the key of `fileMap`, and use the project root directory as the starting path to clean up files before build.
    + `isClearServerPathBeforeDeploy`
      Use the value of `fileMap`, and use the project root directory as the starting path to clean up files before deployment.
    + `isClearLocalDistFileAfterDeploy`
      Use the key of `fileMap`, and use the project root directory as the starting path to clean up files after deployment.

### NOTE
  Line breaks in entry file `/bin/simple-deploy.js` require `LF`(\n) to fit macOS