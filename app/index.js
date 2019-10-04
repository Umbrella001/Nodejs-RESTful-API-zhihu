const Koa = require('koa');  // 导入koa
const koaBody = require('koa-body');
const error = require('koa-json-error');
const parameter = require('koa-parameter');
const koaStatic = require('koa-static');
const path = require('path');
const mongoose = require('mongoose');
const { connectMongodbKey } = require('./config');
const routing = require('./routes');

mongoose.connect(connectMongodbKey,{ useUnifiedTopology: true,useNewUrlParser: true },()=>{console.log('Mongodb connect Success OK')});
mongoose.connection.on('error',console.error);

const app = new Koa();  // 实例化koa

// app.use(async (ctx,next) => {
//     try{
//         await next();
//     }catch(err){
//         ctx.status = err.status || err.statusCode || 500;
//         ctx.body = {
//             message: err.message
//         }
//     }
// })
app.use(koaStatic( path.join(__dirname,'public') ))

app.use(error({
    postFormat: (e,{stack,...rest}) => process.env.NODE_ENV === 'production' ? rest : {stack,...rest}
}));

app.use(koaBody({
    multipart: true,  // 开启文件上传
    formidable:{
        uploadDir: path.join(__dirname,'/public/uploads'), // 使用Node自带的path设置文件上传路径
        keepExtensions: true  // 是否保留文件的拓展名,是
    }
}));

app.use(parameter(app));

routing(app);

  
app.listen(3002,() => {console.log('程序启动成功 监听 3000 端口')})  // 最后让Koa实例一个端口