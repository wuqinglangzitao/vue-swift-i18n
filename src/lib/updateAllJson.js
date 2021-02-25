const {
    openFileByPath,
    getPrefix,
    getLocales,
    getValueFromDotString,
    getEditor,
    showMessage,
    getCustomSetting
} = require("../utils");

const { operation } = require("../utils/constant");
const unflatten = require("unflatten");
const fs = require("fs");
const path = require("path");
const mkdir = require("mkdirp");
const retrieveCN = require("../utils/retrieveCN");
const translate = require("../utils/translate");
// const { msg, Position, Range } = require("../utils/vs");

const tipBeforeWriteJson = async (currentEditor, localesPath) => {
    const {
        notAlertBeforeUpdateI18n,
        puidType
    } = getCustomSetting(currentEditor.document.uri.fsPath, [
        "notAlertBeforeUpdateI18n",
        "puidType"
    ]);
    if (notAlertBeforeUpdateI18n) {
        await writeJson(currentEditor, localesPath, puidType);
    } else {
        await writeJson(currentEditor, localesPath, puidType);
    }
};
// 写入中文资源
const writeJson = async (currentEditor, localesPath, puidType) => {
    const linesObj = retrieveCN(currentEditor, puidType);
    const prefix = getPrefix(currentEditor);
    
    writeFile(localesPath, linesObj, prefix);

    let enPath = localesPath.replace("zh-cn", "en");
    let enDir = path.dirname(enPath);
    if (!fs.existsSync(enDir)) {
        await mkdir.sync(enDir);
        await writeEnJson(enPath, linesObj, prefix);
    } else {
        await writeEnJson(enPath, linesObj, prefix);
    }
};

// 写如英文资源
async function writeEnJson(localesPath, linesObj, prefix) {
	let strArr = Object.keys(linesObj).map(v => {
		return linesObj[v];
	});
    let res = await translate({ query: strArr });
    res && Object.keys(linesObj).forEach((v, i) => { 
        linesObj[v] = res[i];
    });
    writeFile(localesPath, linesObj, prefix);
};
// 写文件
function writeFile(localesPath, linesObj, prefix) {
    fs.readFile(localesPath, (err, data) => {
        let _data;
        if (err) {
            _data = {};
        } else {
            _data = !data.toString() ? {} : JSON.parse(data.toString());
        }
        let temp = getValueFromDotString(_data, prefix);
        if (Object.keys(linesObj).length !== 0) {
            //已存在 => 智能替换（1.相同val时，新的key,val替换原来的key,val。2.不同val时，保存新增key,val和原有的key,val,）
            Object.keys(linesObj).forEach(v => {
                if (!temp || Object.keys(temp).length === 0) {
                    _data[prefix] = linesObj;
                } else {
                    Object.keys(temp).forEach(p => {
                        if (temp[p] === linesObj[v]) {
                            delete temp[p];
                            temp[v] = linesObj[v];
                        } else {
                            temp[v] = linesObj[v];
                        }
                    });
                    _data[prefix] = temp;
                }
            });
        } else {
            showMessage({
                type: "info",
                message: "There are no Chinese match in :",
                file: localesPath,
                needOpen: false
            });
            return;
        }
        let str = JSON.stringify(unflatten(_data), null, 4);
        fs.writeFile(localesPath, str, err => {
            if (!err) {
                // showMessage({
                //     message: `${operation.updateAllI18n.title} Success : ${localesPath}`,
                //     file: localesPath,
                //     editor: currentEditor
                // });
            }
        });
    });
}

module.exports = async ({ editor }) => {
    let currentEditor = getEditor(editor);
    if (!currentEditor) return;
    const defaultLocalesPath = getCustomSetting(
        currentEditor.document.uri.fsPath,
        "defaultLocalesPath"
    );
    const { localesPath, exist } = getLocales({
        fsPath: currentEditor.document.uri.fsPath,
        defaultLocalesPath,
        showError: false,
        showInfo: false
    });

    if (!exist) {
        await mkdir.sync(path.dirname(localesPath));
        await tipBeforeWriteJson(currentEditor, localesPath);
    } else {
        await tipBeforeWriteJson(currentEditor, localesPath);
    }
};
