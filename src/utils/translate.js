const MD5 = require("./MD5");
const axios = require("axios");
// import axios from "axios"
// 个人 - 刘涛
// const appid = '20210201000687431';
// const key = 'zDHvxkjeBwRyllSZkLAf';
// 个人 - 张璐
// const appid = "20210203000689488";
// const key = "XcDMvT_hKg23CYQ0ogHH";
// 企业
const appid = '20210203000689469';
const key = 'MOWW1DIbES9dIGBZgU_j';

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
