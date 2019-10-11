const jwt = require('jsonwebtoken');
const User = require('../models/users'); // 导入用户模型
const Question = require('../models/questions');
const Answer = require('../models/answers');
const { secret } = require('../config');

class UsersCtl{
    /**
     * 增删改查 -- 用户个人信息 -- createUser | getUsers | getUserId | updateUsers | delUser
     * 中间件校验器 -- 授权鉴权 -- checkOwner | login | checkUserExist
     * @param {*} ctx 
     */
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
    /**
     * 增删查 -- 关注/取关与粉丝 -- follow | unfollow | listFollowers(粉丝) | listFollowing(关注)
     * 中间件校验器 -- 检测 -- checkUserExist
     * @param {*} ctx 
     */
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
    /**
     * 增删查 -- 话题与问题 -- followTopic | unfollowTopic | listFollowingTopics(关注的话题)
     * 中间件校验器 -- 检测 -- checkUserExist | checkTopicExist
     * @param {*} ctx 
     */
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
    /**
     * 查 -- 用户问题下的话题 -- listQuestions
     * @param {*} ctx 
     */    
    async listQuestions(ctx){
        const questions = await Question.find({ questioner: ctx.params.id });
        ctx.body = questions;
    }
    /**
     * 增删 -- 回答的 赞/取消赞 与 踩/取消踩 -- likingAnswer | unlikingAnswer | disLikingAnswer | unDisLikingAnswer
     * 查 -- 获取当前用户赞和踩过的回答列表 -- listlikingAnswers | listDisLikingAnswers
     * 中间件校验器 -- 检测 -- checkAnswerExist | checkUserExist
     * @param {*} ctx 
     */
    async likingAnswer(ctx,next){
        const me = await User.findById(ctx.state.user._id).select('+listLikingAnswers +listDisLikingAnswers');
            if(!me.listLikingAnswers.map(id => id.toString()).includes(ctx.params.id)){
                me.listLikingAnswers.push(ctx.params.id);
                me.save();
                await Answer.findByIdAndUpdate(ctx.params.id,{ $inc: { praise: 1}});
            }
            if(me.listDisLikingAnswers.map(id => id.toString()).includes(ctx.params.id)){
                await next();
            }
            ctx.status = 204;
    }

    async unlikingAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+listLikingAnswers +listDisLikingAnswers');
        const index = await me.listLikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.listLikingAnswers.splice(index,1);
            me.save();
            await Answer.findByIdAndUpdate(ctx.params.id,{ $inc: { praise: -1}});
        }
        ctx.status = 204;
    }

    async listLikingAnswers(ctx){
        const user = await User.findById(ctx.params.id).select('+listLikingAnswers').populate('listLikingAnswers');
        if(!user){ ctx.throw(404,"用户不存在")};
        ctx.body = user.listLikingAnswers;
    }

    async disLikingAnswer(ctx,next){
        const me = await User.findById(ctx.state.user._id).select('+listDisLikingAnswers +listLikingAnswers');
            if(!me.listDisLikingAnswers.map(id => id.toString()).includes(ctx.params.id)){
                me.listDisLikingAnswers.push(ctx.params.id);
                me.save();
                await Answer.findByIdAndUpdate(ctx.params.id,{ $inc: { oppose:1}});
            }
            if(me.listLikingAnswers.map(id => id.toString()).includes(ctx.params.id)){
                await next();
            }
            ctx.status = 204;
    }

    async unDisLikingAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+listDisLikingAnswers');
        const index = await me.listDisLikingAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.listDisLikingAnswers.splice(index,1);
            me.save();
            await Answer.findByIdAndUpdate(ctx.params.id,{ $inc: { oppose:-1}});
        }
        ctx.status = 204;
    }

    async listDisLikingAnswers(ctx){
        const user = await User.findById(ctx.params.id).select('+listDisLikingAnswers').populate('listDisLikingAnswers');
        if(!user){ ctx.throw(404,"用户不存在")};
        ctx.body = user.listDisLikingAnswers;
    }
     /**
     * 增删 -- 用户收藏与取消收藏答案 -- collectAnswer | unCollectAnswer
     * 查 -- 获取用户收藏的答案 -- listCollectAnswers
     * 中间件校验器 -- 检测 -- checkAnswerExist | checkUserExist
     * @param {*} ctx 
     */
    async collectAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+listCollectAnswers');
            if(!me.listCollectAnswers.map(id => id.toString()).includes(ctx.params.id)){
                me.listCollectAnswers.push(ctx.params.id);
                me.save();
            }
            ctx.status = 204;
    }

    async unCollectAnswer(ctx){
        const me = await User.findById(ctx.state.user._id).select('+listCollectAnswers');
        const index = await me.listCollectAnswers.map(id => id.toString()).indexOf(ctx.params.id);
        if(index > -1){
            me.listCollectAnswers.splice(index,1);
            me.save();
        }
        ctx.status = 204;
    }

    async listCollectAnswers(ctx){
        const user = await User.findById(ctx.params.id).select('+listCollectAnswers').populate('listCollectAnswers');
        if(!user){ ctx.throw(404,"用户不存在")};
        ctx.body = user.listCollectAnswers;
    }
}

module.exports = new UsersCtl();

