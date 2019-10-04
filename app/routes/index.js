/**
 * 简易脚本  =>  自动导入路由文件并使用
 * 使用Node提供的fs(读取目录的插件)
 * 使用fs.readdirSync获取目录的结构 => 数组
 */

const fs = require('fs');

module.exports = (app) => {
    fs.readdirSync(__dirname).forEach(file =>{
        if(file === 'index.js') return;
        const route = require(`./${file}`);
        app.use(route.routes()).use(route.allowedMethods());
    })
}