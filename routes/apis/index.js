const router = require('express').Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const tweetController = require('../../controllers/apis/tweet-controller')
const followshipController = require('../../controllers/apis/followship-controller')
const { apiErrorHandler } = require('../../middleware/error-handler')
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
router.post('/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReply)
router.post('/tweets/:id/like', authenticated, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)

// 有關followship的routes
router.post('/followships', authenticated, followshipController.postFollowship)
router.delete('/followships/:followingId', authenticated, followshipController.deleteFollowship)

// 有關user的routes
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweet)

router.use('/', apiErrorHandler)

module.exports = router
