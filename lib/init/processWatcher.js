"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// 退出进程时执行动作
var chalk_1 = __importDefault(require("chalk"));
exports.default = (function (callback) {
    callback = callback || function () {
    };
    // before exiting
    process.on('exit', callback);
    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
        console.log('\n' + ' ' + chalk_1.default.bgGray('Ctrl-c') + ' ');
        process.exit(2);
    });
    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function (e) {
        console.log(e.stack);
        process.exit(99);
    });
});
//# sourceMappingURL=processWatcher.js.map