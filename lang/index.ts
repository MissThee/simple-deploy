const i18n_module = require('i18n-nodejs');
// 初始化对象，其中第二参数的路径，为i18n组件中index.js到语言文件的相对路径
const i18n = new i18n_module('zh-CN', './../../lang/locale.json');
// 仅将转换方法导出，并绑定this
export default i18n.__.bind(i18n)