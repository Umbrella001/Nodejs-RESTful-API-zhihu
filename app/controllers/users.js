const jwt = require('jsonwebtoken');
const User = require('../models/users'); // 导入用户模型
const Question = require('../models/questions'); 
const { secret } = require('../config');

class UsersCtl{
    async createUser(ctx){
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
        const { page = 1, per_page = 10 } = ctx.query;
        const pages = Math.max(page * 1, 1) - 1;
        const perPage =  Math.max(per_page * 1, 1);
        if(pages * perPage < user.length){
            ctx.body = await User.find({name: new RegExp(ctx.query.q)}).limit(perPage).skip(pages * perPage);
        }else{
            ctx.throw(401,'当前页数超过展示信息的条数');
        }
    }

    async getUserId(ctx){
        const { fields = '' } = ctx.query;
        const selectFields = fields.split(';').filter(f => f).map(f => ' +' + f).join('');
        const populateStr = fields.split(';').filter(p => p).map(p => {
            if(p === 'employments'){
                return 'employments.company employments.job';
            }else if(p === 'educations'){
                return 'educations.school educations.major';
            }else{
                return p;
            } 
        }).join(' ');
        const user = await User.findById(ctx.params.id).select(selectFields)
        .populate(populateStr);
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

    async checkUserExist(ctx,next){
        const user = await User.findById(ctx.params.id);
        if(!user){ctx.throw(404,'用户不存在')}
        await next();
    }

    async listFollowing(ctx){
        const user = await User.findById(ctx.params.id).select('+following').populate('following');
        if(!user){ ctx.throw(404,"用户不存在")};
        ctx.body = user.following;
    }

    async follow(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following');
        if(ctx.params.id !== ctx.state.user._id){
            if(!me.following.map(id => id.toString()).includes(ctx.params.id)){
                me.following.push(ctx.params.id);
                me.save();
            }
            ctx.status = 204;
        }else{
            ctx.throw(401,'不能关注自己')
        }
    }

    async unfollow(ctx){
        const me = await User.findById(ctx.state.user._id).select('+following');
        const index = await me.following.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.following.splice(index,1);
            me.save()
        }
        ctx.status = 204;
    }

    async listFollowers(ctx){
        const followers = await User.find({ following: ctx.params.id });
        ctx.body = followers;
    }

    async followTopic(ctx){
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        if(ctx.params.id !== ctx.state.user._id){
            if(!me.followingTopics.map(id => id.toString()).includes(ctx.params.id)){
                me.followingTopics.push(ctx.params.id);
                me.save();
            }
            ctx.status = 204;
        }else{
            ctx.throw(401,'不能关注自己')
        }
    }

    async unfollowTopic(ctx){
        const me = await User.findById(ctx.state.user._id).select('+followingTopics');
        const index = await me.followingTopics.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.followingTopics.splice(index,1);
            me.save()
        }
        ctx.status = 204;
    }

    async listFollowingTopics(ctx){
        const user = await User.findById(ctx.params.id).select('+followingTopics').populate('followingTopics');
        if(!user){ ctx.throw(404,"用户不存在")};
        ctx.body = user.followingTopics;
    }

    async listQuestions(ctx){
        const questions = await Question.find({ questioner: ctx.params.id });
        ctx.body = questions;
    }
}

module.exports = new UsersCtl();

