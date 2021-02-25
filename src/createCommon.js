/*
 * @Description:
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-01 09:37:46
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-08 14:49:35
 */
const { registerCommand } = require("./utils/vs");
const { operation } = require("./utils/constant");
const createCommon = require("./lib/createCommon");
const vscode = require("vscode");
module.exports = context => {
    context.subscriptions.push(
        registerCommand(operation.createCommon.cmd, uri => {
            // 👍 only works with files on disk
            const cnPattern = new vscode.RelativePattern(
                uri.path + "/zh-cn",
                "**/*.{json}"
            );
            vscode.workspace.findFiles(cnPattern, "common.json").then(files => {
                if (files.length) {
                    createCommon(files, uri.path, "zh-cn");
                }
            });
            const enPattern = new vscode.RelativePattern(
                uri.path + "/en",
                "**/*.{json}"
            );
            vscode.workspace.findFiles(enPattern, "common.json").then(files => {
                if (files.length) {
                    createCommon(files, uri.path, "en");
                }
            });
        })
    );
};
