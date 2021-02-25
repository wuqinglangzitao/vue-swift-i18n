/*
 * @Description:
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-01 10:48:39
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-07 15:30:48
 */
const { msg } = require("./utils/vs");
const { plugin } = require("./utils/constant");
const swiftI18n = require("./swiftI18n");
const swiftAllI18n = require("./swiftAllI18n");
const showI18n = require("./showI18n");
const flatJson = require("./flatJson");
const updateI18n = require("./updateI18n");
const updateAllI18n = require("./updateAllI18n");
const createCommon = require("./createCommon");
const hoverI18n = require("./hoverI18n");
const openI18nFile = require("./openI18nFile");
const generateRichieRC = require("./generateRichieRC");

function activate(context) {
    // register

    // flat json
    flatJson(context);

    // unFlat json
    flatJson(context, true);

    // i18n replace
    swiftI18n(context);

    swiftAllI18n(context);

    // show i18n replace detail
    showI18n(context);

    // generate i18n json by regexp
    updateI18n(context);

    updateAllI18n(context);

    createCommon(context);

    // hover show i18n detail
    hoverI18n(context);

    // jump to i18n file
    openI18nFile(context);

    // generate config file : richierc.json
    generateRichieRC(context);

    msg.info(`${plugin.name} 已激活！`);
}
exports.activate = activate;
function deactivate() {
    msg.info(`${plugin.name} 已移除！`);
}

module.exports = {
    activate,
    deactivate
};
