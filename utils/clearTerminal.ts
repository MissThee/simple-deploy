import readline from 'readline';

function _interopDefaultLegacy(e: { [x: string]: any; }) {
    return e && typeof e === 'object' && 'default' in e ? e['default'] : e;
}

const readline__default = /*#__PURE__*/_interopDefaultLegacy(readline);

function clearScreen() {
    const repeatCount = process.stdout.rows - 2;
    const blank = repeatCount > 0 ? '\n'.repeat(repeatCount) : '';
    console.log(blank);
    readline__default.cursorTo(process.stdout, 0, 0);
    readline__default.clearScreenDown(process.stdout);
}

const clear = process.stdout.isTTY && !process.env.CI ? clearScreen : () => {
};

export default clear
