/*
 * @Description:
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-02 14:42:39
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-03 14:31:59
 */
const { registerCommand } = require("./utils/vs");
const { openFileByPath } = require("./utils");
const { operation } = require("./utils/constant");
const swiftAllJson = require("./lib/swiftAllJson");
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
        registerCommand(operation.swiftAllI18n.cmd, uri => {
            const pattern = new vscode.RelativePattern(
                uri.path,
                "**/*.{vue,js}"
            );
            vscode.workspace.findFiles(pattern).then(files => {
                if (files.length) {
                    files.forEach(async (uri, index) => {
                        const editor = await vscode.workspace.openTextDocument(
                            uri.path
                        );
                        await swiftAllJson({
                            editor: { ...editor, document: editor },
                            context
                        });
                    });
                    msg.info(`swift completed！`);
                }
            });
        })
    );
};
