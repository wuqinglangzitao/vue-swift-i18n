/*
 * @Description:
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-01 09:37:46
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-07 16:03:41
 */
const { registerCommand } = require("./utils/vs");
const { openFileByPath } = require("./utils");
const { operation } = require("./utils/constant");
const updateAllJson = require("./lib/updateAllJson");
const vscode = require("vscode");
const {
    executeCommand,
    msg,
    open,
    file,
    Range,
    Position,
    workspace,
    showMessage,
    window
} = require("./utils/vs");
module.exports = context => {
    context.subscriptions.push(
        registerCommand(operation.updateAllI18n.cmd, uri => {
            // const isModuleReg = /^\/([\w\/]?)+src\/e6-module-[a-zA-Z]{1,}/;
            // if (!isModuleReg.test(uri.path)) {
            //     showMessage({
            //         type: "info",
            //         message: "Please use it under the src/e6-module folder!",
            //         file: uri.path,
            //         needOpen: false
            //     });
            //     return;
            // }
            // 👍 only works with files on disk
            const pattern = new vscode.RelativePattern(
                uri.path,
                "**/*.{vue,js}"
            );

            vscode.workspace.findFiles(pattern).then(files => {
                if (files.length) {
                    files.forEach(file => {
                        vscode.workspace
                            .openTextDocument(file.path)
                            .then(editor => {
                                // updateAllJson({ editor, context });
                                updateAllJson({
                                    editor: { ...editor, document: editor },
                                    context
                                });
                            });
                    });
                    msg.info(`资源文件已生成！`);
                }
            });
        })
    );
};
