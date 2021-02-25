const {
    Range,
    workspace,
    window,
    executeCommand,
    OverviewRulerLane
} = require("../utils/vs");
const { dollarTRegexp } = require("../utils/regex");
const {
    getLocales,
    getEditor,
    getCustomSetting,
    showMessage
} = require("../utils");
const { defaultStyle, errorStyle, operation } = require("../utils/constant");
const flatten = require("flat");
const fs = require("fs");
const Puid = require("puid");
const puid = new Puid();

let decorationTypesList = {};
const clearDecorations = () => {
    Object.keys(decorationTypesList).forEach(v => {
        decorationTypesList[v].dispose();
    });
    decorationTypesList = {};
};

const updateDecorations = currentEditor => {
    clearDecorations();
    const text = currentEditor.document.getText();
    const defaultLocalesPath = getCustomSetting(
        currentEditor.document.uri.fsPath,
        "defaultLocalesPath"
    );
    const { localesPath, exist } = getLocales({
        fsPath: currentEditor.document.uri.fsPath,
        defaultLocalesPath,
        showInfo: false,
        showError: true
    });
    if (!exist) return;
    fs.readFile(localesPath, (err, data) => {
        if (!err) {
            let i18nObj = !!data.toString() ? JSON.parse(data.toString()) : {};

            const commonPath =
                localesPath.slice(0, localesPath.lastIndexOf("/")) +
                "/common.json";

            if (fs.existsSync(commonPath)) {
                const commonData = fs.readFileSync(commonPath, "utf-8");
                const common = JSON.parse(commonData.toString());
                // const commonFrom = changeObjeValueKey(
                //     getValueFromDotString(common, "common"),
                //     "common"
                // );
                i18nObj = Object.assign({}, i18nObj, common);
            }
            let localeObj = flatten(i18nObj);
            const matches = {};
            const defaultStyleForRegExp = Object.assign({}, defaultStyle, {
                overviewRulerLane: OverviewRulerLane.Right
            });
            const errorStyleForRegExp = Object.assign({}, errorStyle, {
                overviewRulerLane: OverviewRulerLane.Right
            });
            // 重置 decorationTypes
            const decorationTypes = {};
            let match;
            while ((match = dollarTRegexp.exec(text))) {
                const matchedValue = match[0];
                const contentText = localeObj[matchedValue];
                const startPos = currentEditor.document.positionAt(match.index);
                const endPos = currentEditor.document.positionAt(
                    match.index + match[0].length
                );
                const styleForRegExp = contentText
                    ? defaultStyleForRegExp
                    : errorStyleForRegExp;
                const decoration = {
                    range: new Range(startPos, endPos),
                    renderOptions: {
                        after: {
                            color: contentText
                                ? "rgba(153,153,153,0.8)"
                                : "red",
                            contentText: ` ➟ ${contentText}`,
                            fontWeight: "normal",
                            fontStyle: "italic"
                            // textDecoration: `underline solid ${contentText ? "green" : "red"}`
                        }
                    }
                };

                //重复的可以被显示
                const id = puid.generate();
                if (matches[id]) {
                    matches[id].push(decoration);
                } else {
                    matches[id] = [decoration];
                }
                matches[id] = [decoration];
                decorationTypes[id] = window.createTextEditorDecorationType(
                    styleForRegExp
                );
            }
            const types = Object.keys(decorationTypes);
            if (types.length === 0) {
                showMessage({
                    message: `
                There are no matching values ​​in: ${localesPath}`,
                    editor: currentEditor,
                    file: localesPath,
                    callback: {
                        func: () => executeCommand(operation.swiftI18n.cmd),
                        name: operation.swiftI18n.title
                    }
                });
            } else {
                types.forEach((v, p) => {
                    const decorationType = decorationTypes[v];
                    decorationTypesList[v] = decorationTypes[v];
                    const message =
                        operation.showI18n.title +
                        " success with: " +
                        localesPath;
                    currentEditor.setDecorations(decorationType, matches[v]);
                    if (p === types.length - 1) {
                        showMessage({
                            message,
                            file: localesPath,
                            editor: currentEditor
                        });
                    }
                });
            }
        }
    });
};

module.exports = ({ editor, context }) => {
    let currentEditor = getEditor(editor);
    if (!currentEditor) return;
    updateDecorations(currentEditor);
    //修改重置编辑器
    workspace.onDidChangeTextDocument(
        event => {
            if (currentEditor && event.document === currentEditor.document) {
                clearDecorations();
            }
        },
        null,
        context.subscriptions
    );
};
