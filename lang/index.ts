import fs from 'fs'
import path from 'path'

//单例模式简单国际化工具
class I18n {
    static i18nObj: I18n
    langFileDir = ''
    langSign = ''
    langMap: { [originValue: string]: string } = {}

    constructor(langFilePath: string, langSign?: string) {
        if (I18n.i18nObj) {
            return I18n.i18nObj
        }
        this.langFileDir = langFilePath
        this.langSign = langSign || ''
        this.setLang(this.langSign)
        I18n.i18nObj = this
    }

    setLang(langSign: string) {
        this.langSign = langSign
        if (this.langSign) {
            const langFile = path.normalize(path.join(process.cwd(), this.langFileDir, this.langSign)) + '.json'
            this.langMap = fs.existsSync(langFile) ? require(langFile) : {}
        } else {
            this.langMap = {}
        }
    }

    lang(value: string) {
        return Object.keys(this.langMap).indexOf(value) >= 0 ? this.langMap[value] : value
    }
}

const i18n = new I18n('/lang')
const lang = i18n.lang.bind(i18n)
export {
    i18n,
    lang
}
