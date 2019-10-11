const Router = require('koa-router');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const router = new Router({prefix:'/questions/:questionId/answers'});
const {
    getAnswers,
    getAnswerId,
    createAnswer,
    updateAnswer: update,
    delectAnswer: del,
    checkAnswerExist,
    checkAnswerer
} = require('../controllers/answers');

const auth = jwt({ secret });

router.post('/',auth, createAnswer)

router.get('/',getAnswers)

router.get('/:id',checkAnswerExist,getAnswerId)

router.patch('/:id',auth,checkAnswerExist,checkAnswerer,update)

router.delete('/:id',auth,checkAnswerExist,checkAnswerer,del)

module.exports = router;