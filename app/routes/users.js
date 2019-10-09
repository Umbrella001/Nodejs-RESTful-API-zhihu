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
    listQuestions
} = require('../controllers/users');

const { checkTopicExist } = require('../controllers/topics');

const auth = jwt({ secret });

router.post('/',createUser)

router.get('/',getUsers)

router.get('/:id',getUserId)

router.patch('/:id',auth,checkOwner,updateUsers)

router.delete('/:id',auth,checkOwner,delUser)

router.post('/login',login)

router.get('/:id/following',checkUserExist,listFollowing)

router.put('/follow/:id',auth,checkUserExist,follow)

router.delete('/follow/:id',auth,checkUserExist,unfollow)

router.get('/:id/followers',listFollowers)

router.put('/followTopic/:id',auth,checkTopicExist,followTopic)

router.delete('/followTopic/:id',auth,checkTopicExist,unfollowTopic)

router.get('/:id/followingTopics',checkUserExist,listFollowingTopics)

router.get('/:id/questions',listQuestions)

module.exports = router;