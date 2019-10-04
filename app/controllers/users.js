const jwt = require('jsonwebtoken');
const User = require('../models/users'); // 导入用户模型
const { secret } = require('../config');

class UsersCtl{
    async creatUser(ctx){
        ctx.verifyParams({
            name:{type:"string",required: false},
            password:{type:"string",require: false}
        })
        const {name} = ctx.request.body;
        const isRepeatName = await User.findOne({name}); 
        if(isRepeatName) {ctx.throw(409,'用户名已存在！')};
        const user = await new User(ctx.request.body).save();
        ctx.body = user; 
    }
    async getUsers(ctx){
        const user = await User.find();
        ctx.body = user;
    }

    async getUserId(ctx){
        const { fields } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        console.log('++++++++++++++++',selectFields);
        const user = await User.findById(ctx.params.id).select(selectFields);
        if(!user){ ctx.throw(404,"用户不存在")};
        ctx.body = user;
    }

    async checkOwner(ctx,next){
        if(ctx.params.id !== ctx.state.user._id){ctx.throw(403,'没有权限')};
        await next();
    }

    async updateUsers(ctx){
        ctx.verifyParams({
            name:{ type:"string",required: false },
            password:{ type:"string",require: false },
            avatar_url: { type: 'string',require: false },
            gender: { type: 'string',require: false },
            headline: { type: 'string',require: false },
            locations: { type: 'array', itemType: 'string', require: false },
            business: { type: 'string',require: false },
            employments: { type: 'array', itemType: 'object', require: false },
            educations: { type: 'array', itemType: 'object', require: false },
        })
        const user = await User.findByIdAndUpdate(ctx.params.id,ctx.request.body,{useFindAndModify:false});
        if(!user){ ctx.throw(404,"用户不存在")};
        ctx.body = user;
    }
    async delUser(ctx){
        const user = await User.findByIdAndRemove(ctx.params.id,{useFindAndModify:false});
        if(!user){ ctx.throw(404,"用户不存在")};
        ctx.status = 204;
    }
    async login(ctx){
        ctx.verifyParams({
            name: {type:'string', required: true},
            password: {type: 'string', required: true}
        })
        const userInfo = await User.findOne(ctx.request.body);
        if(!userInfo){ctx.throw(401,'用户名或密码不存在！')};
        const { _id,name } = userInfo;
        const token = jwt.sign({ _id,name },secret,{expiresIn: 86400});
        ctx.body = { token };
    }
}

module.exports = new UsersCtl();

