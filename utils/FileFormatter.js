"use strict";
const fs = require("fs");
const indexFileFullPath = './bin/simple-deploy.js'
const codeType = 'utf8'
fs.writeFileSync(
    indexFileFullPath,
    fs.readFileSync(indexFileFullPath, codeType).replace(/\r\n/g, '\n'),
    codeType
);
