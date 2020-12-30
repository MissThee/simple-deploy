import ora from "ora";
import lang from "../../lang";

export default class SimpleSpinner {
    spinner = ora()

    start(...value: string[]) {
        this.spinner.start(value.map(item => lang(item)).join(''))
    }

    succeed(...value: string[]) {
        this.spinner.succeed(value.map(item => lang(item)).join(''))
    }

    succeedAppend(...value: string[]) {
        this.spinner.succeed(this.spinner.text + value.map(item => lang(item)).join(''))
    }

    fail(err?: any, ...value: string[]) {
        this.spinner.fail(value.map(item => lang(item)).join(''))
        if (err) {
            console.log('' + err)
        }
    }

    info(...value: string[]) {
        this.spinner.info(value.map(item => lang(item)).join(''))
    }
}
