const Router = require('koa-router');
const jwt = require('koa-jwt');
const { secret } = require('../config');
const router = new Router({prefix:'/topics'});
const {
    getTopics,
    getTopicId,
    createTopic,
    updateTopic
} = require('../controllers/topics');

const auth = jwt({ secret });

router.post('/',auth, createTopic)

router.get('/',getTopics)

router.get('/:id',getTopicId)

router.patch('/:id',auth,updateTopic)

module.exports = router;