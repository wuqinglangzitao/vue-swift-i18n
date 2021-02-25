/*
 * @Description: 
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-04 17:18:13
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-25 15:42:01
 */
const MD5 = require("./MD5");
const axios = require("axios");
const appid = "20210201000687431";
const key = "zDHvxkjeBwRyllSZkLAf";

async function translate({ query = [], from = "zh", to = "en" }) {
    if (query.length === 0) return;
    let queryStr = query.join("\n");
    let salt = new Date().getTime();
    let str = appid + queryStr + salt + key;
    let sign = MD5(str);
    let ret;
    let res = await axios({
        url: "http://api.fanyi.baidu.com/api/trans/vip/translate",
        method: "get",
        dataType: "jsonp",
        params: {
            q: queryStr,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        }
    });
    const result = res.data.trans_result;
    result &&
        (ret = result.map((r, i) => {
            return r.dst ? r.dst : query[i];
        }));
    return ret;
}
module.exports = translate;
