const Router = require('koa-router');
const router = new Router({prefix:'/users'});
const jwt = require('koa-jwt');
const { secret } = require('../config');
const {
    creatUser,
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
    checkUserExist
} = require('../controllers/users');

const auth = jwt({ secret });

router.post('/',creatUser)

router.get('/',getUsers)

router.get('/:id',getUserId)

router.patch('/:id',auth,checkOwner,updateUsers)

router.delete('/:id',auth,checkOwner,delUser)

router.post('/login',login)

router.get('/:id/following',checkUserExist,listFollowing)

router.put('/follow/:id',auth,checkUserExist,follow)

router.delete('/follow/:id',auth,checkUserExist,unfollow)

router.get('/:id/followers',listFollowers)

module.exports = router;