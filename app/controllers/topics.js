const Topic = require('../models/topics'); // 导入用户模型
const User = require('../models/users');
const Question = require('../models/questions');

class TopicsCtl{
    async getTopics(ctx){
        const topics = await Topic.find();
        const { page = 1, per_page = 10 } = ctx.query;
        const pages = Math.max(page * 1, 1) - 1;
        const perPage =  Math.max(per_page * 1, 1);
        if(pages * perPage < topics.length){
            ctx.body = await Topic.find({name: new RegExp(ctx.query.q)}).limit(perPage).skip(pages * perPage);
        }else{
            ctx.throw(401,'当前页数超过展示信息的条数');
        }
    }

    async getTopicId(ctx){
        const { fields = ''  } = ctx.query;
        const selectFields = fields.split(';').filter(t =>  t).map(t => ' +' + t).join('');
        const topic = await Topic.findById(ctx.params.id).select(selectFields);
        ctx.body = topic;
    }

    async createTopic(ctx){
        ctx.verifyParams({
            name: {type: 'string',required: true},
            avatar_url:{ type: 'string', required: false},
            introduction:{ type: 'string', required: false},
        })
        const topic = await new Topic(ctx.request.body).save();
        ctx.body = topic;
    }
    async updateTopic(ctx){
        ctx.verifyParams({
            name:{type: 'string',required: false},
            avatar_url:{type: 'string',required: false},
            introduction:{type: 'string',required: false}
        });
        const newTopic = await Topic.findByIdAndUpdate(ctx.params.id, ctx.request.body);
        ctx.body = newTopic;
    }

    async checkTopicExist(ctx,next){
        const topic = await Topic.findById(ctx.params.id);
        if(!topic){ctx.throw(404,'话题不存在')}
        await next();
    }

    
    async listFollowTopics(ctx){
        const followTopics = await User.find({ followingTopics: ctx.params.id });
        ctx.body = followTopics;
    }

    async listQuestions(ctx){
        const questions = await Question.find({ topics: ctx.params.id })
        ctx.body = questions;
    }
}

module.exports = new TopicsCtl();

