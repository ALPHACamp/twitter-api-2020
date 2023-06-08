const router = require('express').Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
const tweetController = require('../../controllers/apis/tweet-controller')
const { authenticated, roleChecker, authenticatedAdmin } = require('../../middleware/api-auth')

// 有關admin的routes
router.post('/admin/users', passport.authenticate('local', { session: false }), roleChecker, adminController.adminLogin)
router.use('/admin', authenticatedAdmin, roleChecker, admin)

// 使用者登入註冊
router.post('/signup', userController.signUp)
router.post('/login', passport.authenticate('local', { session: false }), userController.login)

// 有關tweet的routes
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)

// 有關user的routes
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweet)

router.use('/', apiErrorHandler)

module.exports = router
