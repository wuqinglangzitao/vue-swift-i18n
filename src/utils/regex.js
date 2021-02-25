/*
 * @Description:
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-01-29 11:33:42
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-24 11:42:12
 */
//当看到这个页面，说明你对Regexp赋值了↓↓↓
//欢迎使用JavaScript中的RegExp的众多陷阱之一，当flag 是global时，第二次使用它将会从第一次匹配到的lastIndex开始查。。。
//所以只要是变量赋值多次使用的Regexp，都需要使用match，或者在使用完test,exec之后重置lastIndex

//约定:所有汉字匹配均以汉字开头,所有正则针对 单行匹配
// const spaceRegexp = /\s/g; ////  原始
// const spaceRegexp = /[\s|\{\{|\}\}|\`]/g; // lkt
const spaceRegexp = /\s/g; // lkt

const firstSpaceRegexp = /\s+/;
// const quotationRegexp = /[\"|\']/g; ////  原始
const quotationRegexp = /[\"|\'|\`]/g; // lkt

const angleBracketsRegexp = /[\<|\>]/g;
const templateBeginRegexp = /\<template/g;
const templateEndRegexp = /\<\/template/g;
const scriptBeginRegexp = /\<script/g;
const scripteEndRegexp = /\<\/script/g;
//只匹配单行注释，多行注释不考虑
const commentRegexp = /(\/\/)|(<!--)|(?:^|\n|\r)\s*\/\*[\s\S]*?\*\/\s*(?:\r|\n|$)|(?:^|\n|\r)\s*\/\/.*(?:\r|\n|$)/g;

//匹配js中的汉字,配合template range 判断 是否是template中的js汉字  √ (?<!=)["'][\u4e00-\u9fa5]\S*["|']
/* eslint-disabled-next-line */
const scriptDoubleQuotesRegexp = /(?<!=)["'][\u4e00-\u9fa5]\S*["']/g; ////  原始
// const scriptRegexp = /(?<!=)(([`"']?)(\S*[\u4e00-\u9fa5]+\S*))\2{1}/g;
// const scriptRegexp = /((["'])([^"']\S*[\u4e00-\u9fa5]+\S*))\2{1}/g;
// const scriptRegexp = /(?<!=)((["'])([^"']\S*[\u4e00-\u9fa5]+\S*))\2{1}/g;
// const scriptRegexp = /(?<!=)["'`][\u4e00-\u9fa5]\S*["'`]/g; // lkt
// const scriptRegexp = /(?<!=.)(([`"']?)([\w]*[\u4e00-\u9fa5]+[\w]*))\2{1}/g;
const scriptRegexp = /(?<!=)(([`"']?)([\s\w\-”“~]*(?<!(\.+[\u4e00-\u9fa5]*)|(\*[\u4e00-\u9fa5]*))[\u4e00-\u9fa5]+[/\w\s，,\(\)；;\u4e00-\u9fa5]*[\u4e00-\u9fa5]+[\s]*[\w\-\？\?\(\)\.。，：；”“~！!@……]*))\2{1}/g;

//匹配属性中的汉字 √
// const propertyRegexp = /\s\S+=["'][\u4e00-\u9fa5]\S*["']/g; ////  原始
// const propertyRegexp = /\s\S+=((["'])(\S*[\u4e00-\u9fa5]+\S*))\2{1}/g;
// const propertyRegexp = /((["'])([^"']\S*[\u4e00-\u9fa5]+\S*))\2{1}/g;
// const propertyRegexp = /\s\S+=["']+[\w]*[\u4e00-\u9fa5][\S]*["']+/g; // lkt
const propertyRegexp = /\s\S+=(([`"']?)([\w]*[\u4e00-\u9fa5]+[\S]*)+)\2{1}/g;
// const propertyRegexp = /\s\S+=(([`"']?)([[^\s\."'\<\>]*[\u4e00-\u9fa5]+[^\s"'\<\>]*)+)\2{1}/g;

// 单行  匹配 template ><下，空行的汉字（retrieve） ,
// const angleBracketSpaceRegexp = /((?<=\s)[\u4e00-\u9fa5][^\s\<\>]*|(?<=[>\s])[\u4e00-\u9fa5][^\s\<\>|\n]*(?=[\s<]))/g; ////  原始
// const angleBracketSpaceRegexp = /((?<=\s)[^"'][\u4e00-\u9fa5]\S*[^\s\<\>]*|(?<=[>\s])[^"'][\u4e00-\u9fa5]\S*[^\s\<\>|\n]*(?=[\s<]))/g;
// const angleBracketSpaceRegexp = /(((?<=\s)|(?<=\}\}))(?<!`)[^\s\."'`\<\>\}]*[\u4e00-\u9fa5]+[^\s\<\>\{]*|(?<=[>\s])[^\s\."'`\<\>\}]*[\u4e00-\u9fa5]+[^\s\{\<\>|\n]*(?=[\{\s<]))/g; // lkt
const angleBracketSpaceRegexp = /(((?<=`)|(?<=\s)|(?<=\}\}))[^\s\."`'\<\>\}]*[\u4e00-\u9fa5]+[^\s\<\>\{]*|((?<=`)|(?<=[>\s]))[^\s\."`'\<\>\}]*[\u4e00-\u9fa5]+[^\s\{\<\>|\n]*(?=[\{\s<]))/g;

//匹配到特殊字符串说明前面正则匹配有问题，给出提示，去掉匹配
// const warnRegexp = /[{}<>:]/g;
const warnRegexp = /[<>:]/g;

// 匹配 $t替换的字符串
const dollarTRegexp = /(?<=(\$t|i18n\.t)\(["'])[^'"]+/gm;

module.exports = {
    scriptDoubleQuotesRegexp,
    templateBeginRegexp,
    templateEndRegexp,
    scriptBeginRegexp,
    scripteEndRegexp,
    scriptRegexp,
    propertyRegexp,
    angleBracketSpaceRegexp,
    warnRegexp,
    angleBracketsRegexp,
    quotationRegexp,
    spaceRegexp,
    firstSpaceRegexp,
    commentRegexp,
    dollarTRegexp
};
