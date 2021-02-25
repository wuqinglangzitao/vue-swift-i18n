/*
 * @Description:
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-02 14:01:59
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-09 09:12:11
 */
const constants = {
    defaultStyle: {
        fontStyle: "italic"
        // textDecoration: "underline solid green"
    },
    errorStyle: {
        fontStyle: "italic"
        // textDecoration: "underline solid red"
    },
    langArr: ["javascript", "vue"],
    operation: {
        flatJson: { cmd: "vueSwiftI18n.flatJson", title: "Flat Json" },
        unFlatJson: { cmd: "vueSwiftI18n.unFlatJson", title: "unFlat Json" },
        showI18n: {
            cmd: "vueSwiftI18n.showI18n",
            title: "Show I18n Translate Detail"
        },
        updateI18n: {
            cmd: "vueSwiftI18n.updateI18n",
            title: "Update I18n Locales Json"
        },
        updateAllI18n: {
            cmd: "vueSwiftI18n.updateAllI18n",
            title: "Update All I18n Locales Json"
        },
        generateRichieRC: {
            cmd: "vueSwiftI18n.generateRichieRC",
            title: "Generate scope config file"
        },
        swiftI18n: { cmd: "vueSwiftI18n.swiftI18n", title: "Swift I18n" },
        swiftAllI18n: {
            cmd: "vueSwiftI18n.swiftAllI18n",
            title: "Swift All I18n"
        },
        createCommon: {
            cmd: "vueSwiftI18n.createCommon",
            title: "Create Common Locales Json"
        },
        hoverI18n: { cmd: "vueSwiftI18n.hoverI18n", title: "Hover I18n" },
        openI18nFile: { cmd: "vueSwiftI18n.openI18nFile", title: "Open File" }
    },
    plugin: {
        name: "e6-vue-swift-i18n",
        congratulations:
            'Congratulations, your extension "e6-vue-swift-i18n" is now active!',
        noUri: "please selected a json file first"
    },
    defaultConfig: {
        defaultLocalesPath: "locales",
        puidType: "short",
        i18nValueHover: true,
        langFile: "zh-cn",
        modulePrefixFoUpdateJson: "",
        notAlertBeforeUpdateI18n: false,
        parentDirLevel: 1,
        repeatTimes: 1
    },
    pkgFileName: "package.json",
    customConfigFileName: "richierc.json"
};
module.exports = constants;
