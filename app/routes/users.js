const Router = require('koa-router');
const router = new Router({prefix:'/users'});
const jwt = require('koa-jwt');
const { secret } = require('../config');
const {
    createUser,
    getUsers,
    getUserId,
    updateUsers,
    delUser,
    login,
    checkOwner,
    listFollowing,
    follow,
    unfollow,
    listFollowers,
    checkUserExist,
    followTopic,
    unfollowTopic,
    listFollowingTopics,
    listQuestions,
    likingAnswer,
    unlikingAnswer,
    listLikingAnswers,
    disLikingAnswer,
    unDisLikingAnswer,
    listDisLikingAnswers,
    collectAnswer,
    unCollectAnswer,
    listCollectAnswers
} = require('../controllers/users');

const { checkTopicExist } = require('../controllers/topics');
const { checkAnswerExist } = require('../controllers/answers');

const auth = jwt({ secret });

/**
 * 用户个人信息 接口路由
 */
router.post('/',createUser)
router.get('/',getUsers)
router.get('/:id',getUserId)
router.patch('/:id',auth,checkOwner,updateUsers)
router.delete('/:id',auth,checkOwner,delUser)
router.post('/login',login)
/**
 * 用户关注与粉丝 接口路由
 */
router.get('/:id/following',checkUserExist,listFollowing)
router.put('/follow/:id',auth,checkUserExist,follow)
router.delete('/follow/:id',auth,checkUserExist,unfollow)
router.get('/:id/followers',listFollowers)
/**
 * 用户关注的话题 接口路由
 */
router.put('/followTopic/:id',auth,checkTopicExist,followTopic)
router.delete('/followTopic/:id',auth,checkTopicExist,unfollowTopic)
router.get('/:id/followingTopics',checkUserExist,listFollowingTopics)
/**
 * 用户问题下的话题 接口路由
 */
router.get('/:id/questions',listQuestions)
/**
 * 用户对回答赞/踩 接口路由
 */
router.put('/likingAnswers/:id',auth,checkAnswerExist,likingAnswer,unDisLikingAnswer)
router.delete('/likingAnswers/:id',auth,checkAnswerExist,unlikingAnswer)
router.get('/:id/likingAnswers',checkUserExist,listLikingAnswers)

router.put('/disLikingAnswer/:id',auth,checkAnswerExist,disLikingAnswer,unlikingAnswer)
router.delete('/disLikingAnswer/:id',auth,checkAnswerExist,unDisLikingAnswer)
router.get('/:id/disLikingAnswers',checkUserExist,listDisLikingAnswers)
/**
 * 用户对回答赞/踩 接口路由
 */
router.put('/collectingAnswer/:id',auth,checkAnswerExist,collectAnswer)
router.delete('/collectingAnswer/:id',auth,checkAnswerExist,unCollectAnswer)
router.get('/:id/collectingAnswers',checkUserExist,listCollectAnswers)

module.exports = router;