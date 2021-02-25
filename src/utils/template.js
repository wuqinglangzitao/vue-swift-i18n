/*
 * @Description
 * @Version: 1.0
 * @Autor: laikt
 * @Date: 2021-02-08 10:42:35
 * @LastEditors: laikt
 * @LastEditTime: 2021-02-09 10:26:36
 */
module.exports = {
    indexTemplate: componentName => {
        return `const files = require.context('.', true, /\.json$/)
let ${componentName} = {}
files.keys().forEach(key => {
    ${componentName} = { ${componentName}, ...files(key) }
})
export default ${componentName}
`;
    }
};
