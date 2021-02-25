const { msg, Position, Range, executeCommand } = require("../utils/vs");
const {
    getRange,
    getLocales,
    getPrefix,
    getEditor,
    changeObjeValueKey,
    getCustomSetting,
    getValueFromDotString,
    showMessage
} = require("../utils");
const {
    scriptRegexp,
    propertyRegexp,
    angleBracketSpaceRegexp,
    quotationRegexp,
    spaceRegexp,
    commentRegexp
} = require("../utils/regex");
const { operation } = require("../utils/constant");
// const flatten = require("flat");
const fs = require("fs");

const resoloveLine = ({
    lineText,
    reg,
    resoloveReg,
    resoloveMainReg,
    localeObj,
    isScript,
    isTemplate
}) => {
    let text = lineText.replace(reg, str => {
        let temp = str;
        if (reg === propertyRegexp && isTemplate) {
            const prefix = temp.split("=")[0].replace(resoloveReg, " :");
            const mainStr = temp.split("=")[1].replace(resoloveMainReg, "");

            // const prefix = temp.replace(resoloveReg, " :");
            // const mainStr = temp.replace(resoloveMainReg, "");
            const result = localeObj[mainStr];
            if (result) {
                //$t("xx")   template下 属性替换
                return `${prefix}="$t('${result}')"`;
                // return `$t('${result}')`;
            }
        } else {
            const resultStr = str.replace(resoloveReg, "");
            const result = localeObj[resultStr];
            if (result) {
                //{{$t("xx")}}   template下 html替换
                if (reg === angleBracketSpaceRegexp) {
                    let tplReg = /(?<=`)[^\s\}]*[\u4e00-\u9fa5]+[^\s\}](?=`)*/g;

                    if (
                        lineText.match(tplReg) &&
                        lineText.match(tplReg).includes(resultStr)
                    ) {
                        return "${$t('" + result + "')}";
                    }
                    return "{{$t('" + result + "')}}";
                }

                if (reg === scriptRegexp && isScript) {
                    let scriptReg = /(?<=\'|\")[\w]*[\u4e00-\u9fa5]+[\w]*(?=\'|\")/;
                    if (lineText.indexOf("${") > -1 && !scriptReg.test(str)) {
                        return "${this.$t('" + result + "')}";
                    }
                    return "this.$t('" + result + "')";
                }
                if (reg === scriptRegexp && isTemplate) {
                    //$t("xx")   template下 {{ "汉字" }}替换
                    // if (
                    //     // lineText.indexOf("{{") > -1 &&
                    //     lineText.indexOf("`") > -1
                    // ) {
                    //     return "${this.$t('" + result + "')}";
                    // }
                    return "$t('" + result + "')";
                }
            }
        }
        return str;
    });
    return {
        lineText: text
    };
};

module.exports = ({ editor }) => {
    let currentEditor = getEditor(editor);
    if (!currentEditor) return;

    const lineCount = currentEditor.document.lineCount;
    const defaultLocalesPath = getCustomSetting(
        currentEditor.document.uri.fsPath,
        "defaultLocalesPath"
    );
    const range = getRange(currentEditor);
    const prefix = getPrefix(currentEditor);
    const { localesPath, exist } = getLocales({
        fsPath: currentEditor.document.uri.fsPath,
        defaultLocalesPath,
        showError: true,
        showInfo: false
    });
    if (!exist) return;
    fs.readFile(localesPath, (err, data) => {
        if (!err) {
            const _data = JSON.parse(data.toString());
            let localeObj = changeObjeValueKey(
                getValueFromDotString(_data, prefix),
                prefix
            );
            const commonPath =
                localesPath.slice(0, localesPath.lastIndexOf("/")) +
                "/common.json";

            if (fs.existsSync(commonPath)) {
                const commonData = fs.readFileSync(commonPath, "utf-8");
                const common = JSON.parse(commonData.toString());
                const commonFrom = changeObjeValueKey(
                    getValueFromDotString(common, "common"),
                    "common"
                );
                localeObj = { ...localeObj, ...commonFrom };
            }
            // flatten(JSON.parse(data.toString()))[prefix] || {}
            if (!localeObj || Object.keys(localeObj).length === 0) {
                msg.error(localesPath + ` not contains property '${prefix}'`);
                return;
            }
            const lines = [];
            for (let i = 0; i < lineCount; i++) {
                //使用text替换,getWordRangeAtPosition无法替换全部
                const line = currentEditor.document.lineAt(i);
                let lineData = {
                    lineText: line.text || ""
                };
                const isTemplate = range.template.end && i < range.template.end;
                const isScript = !range.template.end || i > range.template.end;
                if (
                    (!range.template.begin &&
                        range.template.begin !== 0 &&
                        range.template.end) ||
                    (range.template.begin &&
                        !range.template.end &&
                        range.template.end !== 0)
                ) {
                    msg.error("当前vue文件template标签不完整");
                    return;
                }
                if (
                    (!range.script.begin &&
                        range.script.begin !== 0 &&
                        range.script.end) ||
                    (range.script.begin &&
                        !range.script.end &&
                        range.script.end !== 0)
                ) {
                    msg.error("当前vue文件script标签不完整");
                    return;
                }

                //过滤单行注释，多行注释不考虑
                if (!lineData.lineText.match(commentRegexp)) {
                    //匹配 template ><下的汉字
                    if (lineData.lineText.match(angleBracketSpaceRegexp)) {
                        lineData = resoloveLine({
                            lineText: lineData.lineText,
                            reg: angleBracketSpaceRegexp,
                            resoloveReg: spaceRegexp,
                            localeObj,
                            isScript,
                            isTemplate
                        });
                    }

                    //匹配属性中的汉字
                    if (lineData.lineText.match(propertyRegexp)) {
                        lineData = resoloveLine({
                            lineText: lineData.lineText,
                            reg: propertyRegexp,
                            resoloveReg: spaceRegexp,
                            resoloveMainReg: quotationRegexp,
                            localeObj,
                            isScript,
                            isTemplate
                        });
                    }

                    //匹配script中的汉字
                    if (lineData.lineText.match(scriptRegexp)) {
                        lineData = resoloveLine({
                            lineText: lineData.lineText,
                            reg: scriptRegexp,
                            resoloveReg: quotationRegexp,
                            localeObj,
                            isScript,
                            isTemplate
                        });
                    }
                }
                lines.push(lineData.lineText);
            }
            const editText = lines.join("\n");
            currentEditor
                .edit(editBuilder => {
                    const end = new Position(lineCount + 1, 0);
                    editBuilder.replace(
                        new Range(new Position(0, 0), end),
                        editText
                    );
                })
                .then(success => {
                    if (success) {
                        showMessage({
                            message: `${operation.swiftI18n.title} success with \'${prefix}\' in ${localesPath}!`,
                            needOpen: false,
                            callback: {
                                func: () =>
                                    executeCommand(operation.showI18n.cmd),
                                name: operation.showI18n.title
                            }
                        });
                    }
                });
        }
    });
};
