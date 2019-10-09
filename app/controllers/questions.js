const Question = require('../models/questions'); // 导入用户模型

class TopicsCtl{
    async getQuestions(ctx){
        const questions = await Question.find();
        const { page = 1, per_page = 10 } = ctx.query;
        const pages = Math.max(page * 1, 1) - 1;
        const perPage =  Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        if(pages * perPage < questions.length){
            ctx.body = await Question.find({$or:[{title: q},{description: q}]}).limit(perPage).skip(pages * perPage);
        }else{
            ctx.throw(401,'当前页数超过展示信息的条数');
        }
    }

    async getQuestionId(ctx){
        const { fields = ''  } = ctx.query;
        const selectFields = fields.split(';').filter(t =>  t).map(t => ' +' + t).join('');
        const question = await Question.findById(ctx.params.id).select(selectFields).populate('questioner topics');
        ctx.body = question;
    }

    async createQuestion(ctx){
        ctx.verifyParams({
            title: {type: 'string',required: true},
            description:{ type: 'string', required: false},
            topics:{type: 'array',itemType:'string',require: false}
        })
        const question = await new Question({...ctx.request.body,questioner: ctx.state.user._id}).save();
        ctx.body = question;
    }
    async updateQuestion(ctx){
        ctx.verifyParams({
            title: {type: 'string',required: false},
            description:{ type: 'string', required: false},
            topics:{type: 'array',itemType:'string',require: false}
        });
        await ctx.state.question.update(ctx.request.body);
        ctx.body = ctx.state.question;
    }

    async delectQuestion(ctx){
        await Question.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    async checkQuestionExist(ctx,next){
        const question = await Question.findById(ctx.params.id).select('+questioner');
        if(!question){ctx.throw(404,'问题不存在')}
        ctx.state.question = question;
        await next();
    }
    
    async checkQuestionerExist(ctx,next){
        const { question } = ctx.state;
        if(question.questioner.toString() !== ctx.state.user._id){ ctx.throw(403,'没有权限')}
        await next();
    }
}

module.exports = new TopicsCtl();

