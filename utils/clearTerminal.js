"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require('readline');
function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e['default'] : e;
}
var readline__default = /*#__PURE__*/ _interopDefaultLegacy(readline);
function clearScreen() {
    var repeatCount = process.stdout.rows - 2;
    var blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : '';
    console.log(blank);
    readline__default.cursorTo(process.stdout, 0, 0);
    readline__default.clearScreenDown(process.stdout);
}
var clear = process.stdout.isTTY && !process.env.CI ? clearScreen : function () {
};
exports.default = clear;
//# sourceMappingURL=clearTerminal.js.map