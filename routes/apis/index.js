const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
<<<<<<< HEAD
const user = require('./modules/user')
const userController = require('../../controllers/apis/user-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
=======
const tweet = require('./modules/tweet')
>>>>>>> origin/development

router.use('/admin', admin)
router.use('/users', user)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

<<<<<<< HEAD
router.use('/', apiErrorHandler)

module.exports = router
=======
router.use('/tweets', tweet)
/* TODO: 測試/api路由可運作使用，完成後須把(req, res) => res.send('Hello api')部分刪除 */
router.use('/', apiErrorHandler, (req, res) => res.send('Hello api'))

module.exports = router
>>>>>>> origin/development
