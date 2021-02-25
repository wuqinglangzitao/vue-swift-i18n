/*
 * @Description:
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-01-27 11:19:31
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-01 14:36:08
 */
module.exports = (first, second) => {
  if (typeof first !== "string" || typeof second !== "string") {
    return false;
  }
  const endWithDot = /\.$/;
  const beginWithDot = /^\./;
  if (endWithDot.test(first)) {
    return beginWithDot.test(second) ? first + second.slice(1) : first + second;
  } else {
    return beginWithDot.test(second) ? first + second : first + "." + second;
  }
};
