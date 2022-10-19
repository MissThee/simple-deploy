"use strict";
const fs = require("fs");
const indexFileFullPath = './bin/simple-deploy.js'
const codeType = 'utf8'
fs.writeFileSync(
    indexFileFullPath,
    fs.readFileSync(indexFileFullPath, codeType).replace(/\r\n/g, '\n'), // 发布时，修正执7行文件的换行符，以兼容mac、linux环境
    codeType
);
