"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lang = exports.i18n = void 0;
var fs_1 = __importDefault(require("fs"));
var path_1 = __importDefault(require("path"));
// simple i18n
//单例模式简单国际化工具
var I18n = /** @class */ (function () {
    function I18n(langFilePath, langSign) {
        this.langFileDir = '';
        this.langSign = '';
        this.langMap = {};
        if (I18n.i18nObj) {
            return I18n.i18nObj;
        }
        this.langFileDir = langFilePath;
        this.langSign = langSign || '';
        this.setLang(this.langSign);
        I18n.i18nObj = this;
    }
    I18n.prototype.setLang = function (langSign) {
        this.langSign = langSign;
        if (this.langSign) {
            var langFile = path_1.default.normalize(path_1.default.join(process.cwd(), this.langFileDir, this.langSign)) + '.json';
            this.langMap = fs_1.default.existsSync(langFile) ? require(langFile) : {};
        }
        else {
            this.langMap = {};
        }
    };
    I18n.prototype.lang = function (value) {
        return Object.keys(this.langMap).indexOf(value) >= 0 ? this.langMap[value] : value;
    };
    return I18n;
}());
var i18n = new I18n('/lang');
exports.i18n = i18n;
var lang = i18n.lang.bind(i18n);
exports.lang = lang;
//# sourceMappingURL=index.js.map