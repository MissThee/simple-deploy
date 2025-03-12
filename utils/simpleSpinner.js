import ora from "ora";
import { lang } from "../lang/index.js";
class SimpleSpinner {
    constructor() {
        this.spinner = ora();
    }
    start(...value) {
        this.spinner.start(value.map(item => lang(item)).join(''));
    }
    succeed(...value) {
        this.spinner.succeed(value.map(item => lang(item)).join(''));
    }
    succeedAppend(...value) {
        this.spinner.succeed(this.spinner.text + value.map(item => lang(item)).join(''));
    }
    fail(err, ...value) {
        this.spinner.fail(value.map(item => lang(item)).join(''));
        if (err) {
            console.log('' + err);
        }
    }
    info(...value) {
        this.spinner.info(value.map(item => lang(item)).join(''));
    }
    warn(...value) {
        this.spinner.warn(value.map(item => lang(item)).join(''));
    }
}
const spinner = new SimpleSpinner();
export default spinner;
