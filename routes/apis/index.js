const router = require('express').Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const tweetController = require('../../controllers/apis/tweet-controller')
const { authenticated, roleChecker } = require('../../middleware/api-auth')

// 有關admin的routes
router.post('/admin/users', passport.authenticate('local', { session: false }), roleChecker, adminController.adminLogin)
router.use('/admin', authenticated, roleChecker, admin)

// 使用者登入註冊
router.post('/signup', userController.signUp)
router.post('/login', passport.authenticate('local', { session: false }), userController.login)

// 有關tweet的routes
router.post('/tweets', authenticated, tweetController.postTweet)

router.use('/', apiErrorHandler)

module.exports = router
