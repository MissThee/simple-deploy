"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var buildConfig_1 = __importDefault(require("./buildConfig"));
var buildFile_1 = __importDefault(require("./buildFile"));
var ora_1 = __importDefault(require("ora"));
var lang_1 = __importDefault(require("../../lang"));
var chalk_1 = __importDefault(require("chalk"));
var fs_1 = __importDefault(require("fs"));
exports.default = (function (configFileOutputPath) {
    if (fs_1.default.existsSync(configFileOutputPath)) {
        ora_1.default().warn(chalk_1.default.yellow(lang_1.default('The configuration file already exists, creating it again will overwrite the existing file') + chalk_1.default.yellow(": ") + chalk_1.default.underline.blueBright.bold(configFileOutputPath)));
    }
    buildConfig_1.default().then(function (config) {
        var spinner = ora_1.default('Generating configuration file').start();
        buildFile_1.default(configFileOutputPath, config).then(function () {
            spinner.succeed(lang_1.default(chalk_1.default.green.bold('Generate configuration file')) + chalk_1.default.yellow(": ") + chalk_1.default.underline.blueBright.bold(configFileOutputPath));
        });
    });
});
//# sourceMappingURL=index.js.map