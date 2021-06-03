module.exports = {
	"local": {
		"projectName": "@missthee/simple-deploy",
		"sshPrivateKeyPath": "~/.ssh/id_rsa",
		"sshPassphrase": ""
	},
	"env": {
		"dev": {
			"project": {
				"projectBuildScript": "tsc --watch"
			},
			"fileMap": {
				"dist": "\\example1\\example2"
			},
			"server": {
				"serverHost": "",
				"serverPort": 22,
				"serverUsername": "root",
				"serverPassword": ""
			},
			"other": {
				"isClearServerPathBeforeDeploy": false,
				"isClearLocalDistFileBeforeBuild": false,
				"isClearLocalDistFileAfterDeploy": false
			}
		}
	}
}