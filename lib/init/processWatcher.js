// 退出进程时执行动作
import chalk from "chalk";
export default (callback) => {
    callback = callback || function () {
    };
    // before exiting
    process.on('exit', callback);
    // catch ctrl+c event and exit normally
    process.on('SIGINT', function () {
        console.log('\n' + ' ' + chalk.bgGray('Ctrl-c') + ' ');
        process.exit(2);
    });
    //catch uncaught exceptions, trace, then exit normally
    process.on('uncaughtException', function (e) {
        console.log(e.stack);
        process.exit(99);
    });
};
