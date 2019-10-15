const Comment = require('../models/comments'); // 导入用户模型

class CommentsCtl{
    async getComments(ctx){
        const anwers = await Comment.find();
        const { page = 1, per_page = 10 } = ctx.query;
        const pages = Math.max(page * 1, 1) - 1;
        const perPage =  Math.max(per_page * 1, 1);
        const q = new RegExp(ctx.query.q);
        const {questionId, answerId} = ctx.params;
        const { rootCommentId } = ctx.query;
        if(pages * perPage <= anwers.length){
            ctx.body = await Comment.find({content: q,questionId,answerId,rootCommentId})
            .limit(perPage)
            .skip(pages * perPage)
            .populate('commentator replyTo');
        }else{
            ctx.throw(401,'当前页数超过展示信息的条数');
        }
    }

    async getCommentId(ctx){
        const { fields = ''  } = ctx.query;
        const selectFields = fields.split(';').filter(t =>  t).map(t => ' +' + t).join('');
        const comment = await Comment.findById(ctx.params.id).select(selectFields).populate('commentator questionId answerId');
        ctx.body = comment;
    }

    async createComment(ctx){
        ctx.verifyParams({
            content: {type: 'string', required: true},
            rootCommentId: {type: 'string', required: false},
            replyTo: {type: 'string', required: false}
        })
        const commentator = ctx.state.user._id;
        const { questionId,answerId } = ctx.params;
        const comment = await new Comment({...ctx.request.body,answerId,questionId,commentator}).save();
        ctx.body = comment;
    }
    async updateComment(ctx){
        ctx.verifyParams({
            content: {type: 'string', required: true}
        });
        const { content } = ctx.request.body;
        await ctx.state.comment.update({content});
        ctx.body = ctx.state.comment;
    }

    async delectComment(ctx){
        await Comment.findByIdAndRemove(ctx.params.id);
        ctx.status = 204;
    }

    async checkCommentExist(ctx,next){
        const comment = await Comment.findById(ctx.params.id).select('+commentator');
        if(!comment){ctx.throw(404,'评论不存在')};
        if(ctx.params.questionId && comment.questionId.toString() !== ctx.params.questionId){
            ctx.throw(404,'该问题下不存在此评论')
        };
        if(ctx.params.answerId && comment.answerId.toString() !== ctx.params.answerId){
            ctx.throw(404,'该答案下不存在此评论')
        };
        ctx.state.comment = comment;
        await next();
    }
    
    async checkCommentator(ctx,next){
        const { comment } = ctx.state;
        if(comment.commentator.toString() !== ctx.state.user._id){ ctx.throw(403,'没有权限')}
        await next();
    }
}

module.exports = new CommentsCtl();

