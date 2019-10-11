const Answer = require('../models/answers'); // 导入用户模型

class AnswersCtl{
    async getAnswers(ctx){
        const anwers = await Answer.find();
        const { page = 1, per_page = 10 } = ctx.query;
        const pages = Math.max(page * 1, 1) - 1;
        const perPage =  Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        if(pages * perPage < anwers.length){
            ctx.body = await Answer.find({content: q,questionId: ctx.params.questionId}).limit(perPage).skip(pages * perPage);
        }else{
            ctx.throw(401,'当前页数超过展示信息的条数');
        }
    }

    async getAnswerId(ctx){
        const { fields = ''  } = ctx.query;
        const selectFields = fields.split(';').filter(t =>  t).map(t => ' +' + t).join('');
        const answer = await Answer.findById(ctx.params.id).select(selectFields).populate('answerer questionId');
        ctx.body = answer;
    }

    async createAnswer(ctx){
        ctx.verifyParams({
            content: {type: 'string', required: true}
        })
        const answerer = ctx.state.user._id;
        const { questionId } = ctx.params;
        const answer = await new Answer({...ctx.request.body,answerer,questionId}).save();
        ctx.body = answer;
    }
    async updateAnswer(ctx){
        ctx.verifyParams({
            content: {type: 'string', required: true}
        });
        await ctx.state.answer.update(ctx.request.body);
        ctx.body = ctx.state.answer;
    }

    async delectAnswer(ctx){
        await Answer.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    async checkAnswerExist(ctx,next){
        const answer = await Answer.findById(ctx.params.id).select('+answerer');
        if(!answer){ctx.throw(404,'答案不存在')};
        if(ctx.params.questionId && answer.questionId.toString() !== ctx.params.questionId){
            ctx.throw(404,'该问题下不存在此答案')
        };
        ctx.state.answer = answer;
        await next();
    }
    
    async checkAnswerer(ctx,next){
        const { answer } = ctx.state;
        if(answer.answerer.toString() !== ctx.state.user._id){ ctx.throw(403,'没有权限')}
        await next();
    }
}

module.exports = new AnswersCtl();

