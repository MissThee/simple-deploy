"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ora_1 = __importDefault(require("ora"));
var lang_1 = require("../lang");
var SimpleSpinner = /** @class */ (function () {
    function SimpleSpinner() {
        this.spinner = ora_1.default();
    }
    SimpleSpinner.prototype.start = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        this.spinner.start(value.map(function (item) { return lang_1.lang(item); }).join(''));
    };
    SimpleSpinner.prototype.succeed = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        this.spinner.succeed(value.map(function (item) { return lang_1.lang(item); }).join(''));
    };
    SimpleSpinner.prototype.succeedAppend = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        this.spinner.succeed(this.spinner.text + value.map(function (item) { return lang_1.lang(item); }).join(''));
    };
    SimpleSpinner.prototype.fail = function (err) {
        var value = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            value[_i - 1] = arguments[_i];
        }
        this.spinner.fail(value.map(function (item) { return lang_1.lang(item); }).join(''));
        if (err) {
            console.log('' + err);
        }
    };
    SimpleSpinner.prototype.info = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        this.spinner.info(value.map(function (item) { return lang_1.lang(item); }).join(''));
    };
    SimpleSpinner.prototype.warn = function () {
        var value = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            value[_i] = arguments[_i];
        }
        this.spinner.warn(value.map(function (item) { return lang_1.lang(item); }).join(''));
    };
    return SimpleSpinner;
}());
var spinner = new SimpleSpinner();
exports.default = spinner;
//# sourceMappingURL=simpleSpinner.js.map