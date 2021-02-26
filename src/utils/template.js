/*
 * @Description
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-08 10:42:35
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-25 17:23:27
 */
module.exports = {
  indexTemplate: componentName => {
    return `const files = require.context('.', true, /\.json$/)
let ${componentName} = {}
files.keys().forEach(key => {
    let name = Object.keys(files(key))[0];
  if (name && ${componentName}.hasOwnProperty(name)) {
    ${componentName}[name] = { ...${componentName}[name], ...files(key)[name] };
  } else {
    ${componentName} = { ...${componentName}, ...files(key) };
  }
   
})
export default ${componentName}
`;
  }
};
