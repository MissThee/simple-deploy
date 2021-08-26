"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = __importDefault(require("path"));
var chalk_1 = __importDefault(require("chalk"));
exports.default = (function () { return __awaiter(void 0, void 0, void 0, function () {
    function getLocalPackage() {
        return require(path_1.default.resolve(__dirname, "../package.json")); // 从 package 中获取版本
    }
    function getServerVersion(name) {
        return new Promise(function (resolve, reject) {
            var https = require('https');
            https.get("https://registry.npmjs.org/" + name, function (res) {
                var data = '';
                res.on('data', function (chunk) {
                    data += chunk;
                });
                res.on('end', function () {
                    var latest = (JSON.parse(data)["dist-tags"] || {}).latest; // 获取最新版本
                    resolve(latest);
                });
            }).on("error", function (err) {
                resolve(null);
            });
        });
    }
    var localPackage, packageName, packageVersion, getServerVersionRes, line1, line2, lineLength, spaceStr, longLength, line1Origin, line2Origin, splitStr;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                localPackage = getLocalPackage();
                packageName = localPackage.name;
                packageVersion = localPackage.version;
                return [4 /*yield*/, getServerVersion(packageName)];
            case 1:
                getServerVersionRes = _a.sent();
                if (packageVersion === getServerVersionRes || !getServerVersionRes) {
                    return [2 /*return*/, ''];
                }
                line1 = 'Update available ' + packageVersion + ' → ' + chalk_1.default.green(getServerVersionRes);
                line2 = 'Run ' + chalk_1.default.magenta('npm i ' + packageName + '@' + getServerVersionRes + ' -D') + ' to update';
                lineLength = line1.length - line2.length;
                spaceStr = ' '.repeat(Math.abs(lineLength / 2));
                if (lineLength > 0) {
                    line2 = spaceStr + line2;
                }
                if (lineLength <= 0) {
                    line1 = spaceStr + line1;
                }
                line1Origin = 'Update available ' + packageVersion + ' → ' + getServerVersionRes;
                line2Origin = 'Run npm i ' + packageName + '@' + getServerVersionRes + ' -D to update';
                longLength = Math.max(line1Origin.length, line2Origin.length);
                splitStr = '-'.repeat(longLength);
                return [2 /*return*/, '\n' + chalk_1.default.yellow(splitStr) + '\n' + line1 + '\n' + line2 + '\n' + chalk_1.default.yellow(splitStr) + '\n'];
        }
    });
}); });
//# sourceMappingURL=checkForUpdates.js.map