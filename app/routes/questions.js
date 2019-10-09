const Router = require('koa-router');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const router = new Router({prefix:'/questions'});
const {
    getQuestions,
    getQuestionId,
    createQuestion,
    updateQuestion: update,
    delectQuestion: del,
    checkQuestionExist,
    checkQuestionerExist
} = require('../controllers/questions');

const auth = jwt({ secret });

router.post('/',auth, createQuestion)

router.get('/',getQuestions)

router.get('/:id',checkQuestionExist,getQuestionId)

router.patch('/:id',auth,checkQuestionExist,checkQuestionerExist,update)

router.delete('/:id',auth,checkQuestionExist,checkQuestionerExist,del)

module.exports = router;