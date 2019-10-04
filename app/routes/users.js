const Router = require('koa-router');
const router = new Router({prefix:'/users'});
const jwt = require('koa-jwt');
const { secret } = require('../config');
const {creatUser,getUsers,getUserId,updateUsers,delUser,login,checkOwner} = require('../controllers/users');

// const auth = async(ctx,next) =>{
//     const { authorization = '' } = ctx.request.header;
//     const token = authorization.replace('Bearer ','');
//     try{
//         const userInfo = jwt.verify(token,secret);
//         ctx.state.user = userInfo;
//     }catch(err){
//         ctx.throw(401,err.message);
//     }
//     await next();
// }

const auth = jwt({ secret });

router.post('/',creatUser)

router.get('/',getUsers)

router.get('/:id',getUserId)

router.patch('/:id',auth,checkOwner,updateUsers)

router.delete('/:id',auth,checkOwner,delUser)

router.post('/login',login)

module.exports = router;