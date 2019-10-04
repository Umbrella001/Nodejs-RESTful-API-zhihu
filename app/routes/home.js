const Router = require('koa-router');
const router = new Router();
const { home, upload } = require('../controllers/home')

router.get('/',home);
router.post('/upload',upload)

module.exports = router;