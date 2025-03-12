import fs from 'fs';
import path from 'path';
// simple i18n
//单例模式简单国际化工具
class I18n {
    constructor(langFilePath, langSign) {
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
    setLang(langSign) {
        this.langSign = langSign;
        if (this.langSign) {
            const langFile = path.normalize(path.join(process.cwd(), this.langFileDir, this.langSign)) + '.json';
            this.langMap = fs.existsSync(langFile) ? require(langFile) : {};
        }
        else {
            this.langMap = {};
        }
    }
    lang(value) {
        return Object.keys(this.langMap).indexOf(value) >= 0 ? this.langMap[value] : value;
    }
}
const i18n = new I18n('/lang');
const lang = i18n.lang.bind(i18n);
export { i18n, lang };
