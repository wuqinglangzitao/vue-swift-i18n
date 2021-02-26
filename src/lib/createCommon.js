/*
 * @Description:
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-07 15:15:21
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-26 09:16:38
 */
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
const flatten = require("flat");
const createCommon = require("../createCommon");
const Puid = require("puid");
const { indexTemplate } = require("../utils/template");
const duplicate = (path, array) => {
  const tmp = [];
  const repeatTimes = getCustomSetting(path, "repeatTimes");
  if (Array.isArray(array)) {
    const repeatData = array.reduce((previousValue, currentValue) => {
      if (previousValue[currentValue]) {
        previousValue[currentValue]++;
      } else {
        previousValue[currentValue] = 1;
      }
      return previousValue;
    }, {});
    for (const key in repeatData) {
      if (
        Object.hasOwnProperty.call(repeatData, key) &&
        repeatData[key] >= repeatTimes
      ) {
        tmp.push(key);
      }
    }

    // array
    //     .concat()
    //     .sort()
    //     .sort(function(a, b) {
    //         if (a == b && tmp.indexOf(a) === -1) tmp.push(a);
    //     });
  }
  return tmp;
};
const getlinesObj = (arr, puid) =>
  arr.reduce((p, c) => {
    const id = puid.generate();
    p[id] = c;
    return p;
  }, {});
const getJsonData = path => {
  const data = fs.readFileSync(path, "utf-8");
  const nodeData = flatten(JSON.parse(data.toString()));
  return {
    data: { path: path, data: nodeData },
    keys: Object.values(nodeData)
  };
};
const getJsonDataList = filesPath => {
  const jsonData = [];
  const jsonValues = [];
  filesPath.forEach(path => {
    const { data, keys } = getJsonData(path);
    jsonData.push(data);
    jsonValues.push(...Object.values(keys));
  });
  return { jsonData, jsonValues };
};
// 写入文件
const generateFile = (path, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, "utf8", err => {
      if (err) {
        errorLog(err.message);
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

const updatedJson = (jsonData, Intersection) => {
  jsonData.forEach(e => {
    let cont = 0;
    for (const key in e.data) {
      if (Intersection.includes(e.data[key])) {
        delete e.data[key];
        cont++;
      }
    }
    if (cont !== 0) {
      let str = JSON.stringify(unflatten(e.data), null, 4);
      fs.writeFile(e.path, str, err => {
        if (err) {
          showMessage({
            message: err
          });
        }
      });
    }
  });
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
        showMessage({
          message: `${operation.updateI18n.title} Success : ${localesPath}`,
          file: localesPath
        });
      }
    });
  });
}
// 写如英文资源

module.exports = async (files, path, name) => {
  const filesPath = files.map(e => e.path);
  // 获取 所有json values
  let { jsonData, jsonValues } = getJsonDataList(filesPath);
  // 合并common 以及所有json values
  if (fs.existsSync(path + "/" + name + "/common.json")) {
    let commonData = fs.readFileSync(
      path + "/" + name + "/common.json",
      "utf-8"
    );
    commonData = flatten(JSON.parse(commonData.toString()));
    jsonValues = [
      ...jsonValues,
      ...Object.values(commonData),
      ...Object.values(commonData)
    ];
  }
  // 获取重复项
  const Intersection = duplicate(path, jsonValues);
  if (!Intersection.length) {
    return false;
  }
  // 删除重复项
  updatedJson(jsonData, Intersection);
  const fileName = name.replace(/\-[a-z]*/g, function(match) {
    return match.slice(1).toUpperCase();
  });
  // 生成index.js
  generateFile(`${path}/${name}/index.js`, indexTemplate(fileName));
  const puid = new Puid("short");
  const linesObj = getlinesObj(Intersection, puid);
  let str = JSON.stringify(unflatten({ common: linesObj }), null, 4);
  // 写入common
  if (name === "zh-cn") {
    writeFile(`${path}/${name}/common.json`, linesObj, "common");
    let strArr = Object.keys(linesObj).map(v => {
      return linesObj[v];
    });
    let res = await translate({ query: strArr });
    res &&
      Object.keys(linesObj).forEach((v, i) => {
        linesObj[v] = res[i];
      });
    await writeFile(`${path}/en/common.json`, linesObj, "common");
  }
  // fs.writeFile(`${path}/${name}/common.json`, str, err => {
  //     if (!err) {
  //         showMessage({
  //             message: `${operation.createCommon.title} Success : ${path}/${name}/common.json`,
  //             file: localesPath
  //         });
  //     }
  // });
};
