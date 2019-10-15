const Router = require('koa-router');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const router = new Router({prefix:'/questions/:questionId/answers/:answerId/comments'});
const {
    getComments,
    getCommentId,
    createComment,
    updateComment: update,
    delectComment: del,
    checkCommentExist,
    checkCommentator
} = require('../controllers/comments');

const auth = jwt({ secret });

router.post('/',auth, createComment)

router.get('/',getComments)

router.get('/:id',checkCommentExist,getCommentId)

router.patch('/:id',auth,checkCommentExist,checkCommentator,update)

router.delete('/:id',auth,checkCommentExist,checkCommentator,del)

module.exports = router;