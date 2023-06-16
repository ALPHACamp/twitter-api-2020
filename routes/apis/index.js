const router = require('express').Router()
const passport = require('../../config/passport')
const admin = require('./modules/admin')
const userController = require('../../controllers/apis/user-controller')
const adminController = require('../../controllers/apis/admin-controller')
const tweetController = require('../../controllers/apis/tweet-controller')
const followshipController = require('../../controllers/apis/followship-controller')
const { uploadFiles } = require('../../middleware/multer')
const { apiErrorHandler } = require('../../middleware/error-handler')
const { authenticated, roleChecker, authenticatedAdmin } = require('../../middleware/api-auth')

// 有關admin的routes
// admin登入
router.post('/admin/users', passport.authenticate('local', { session: false }), roleChecker, adminController.adminLogin)
router.use('/admin', authenticatedAdmin, roleChecker, admin)

// 有關tweet的routes
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets/:tweet_id/replies', authenticated, tweetController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, tweetController.getReply)
router.post('/tweets/:id/like', authenticated, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)
router.get('/tweets/:tweet_id', authenticated, tweetController.getTweet)

// 有關followship的routes
router.post('/followships/', authenticated, followshipController.postFollowship)
router.delete('/followships/:followingId', authenticated, followshipController.deleteFollowship)

// 有關user的routes
router.get('/users/top', authenticated, userController.getTopUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserRepliedTweet)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/likes', authenticated, userController.getUserLiked) // 看見某使用者點過的 Like
router.get('/users/:id/followings', authenticated, userController.getUserFollows) // 看見某使用者跟隨中的人
router.get('/users/:id/followers', authenticated, userController.getUserFollowers) // 看見某使用者的跟隨者
router.put('/users/:id/setting', authenticated, userController.putUserSetting) // 編輯帳號設定
router.put('/users/:id', authenticated, uploadFiles, userController.editUserProfile) // 編輯個人資料

// 使用者登入
router.post('/users/login', passport.authenticate('local', { session: false }), userController.login)
// 使用者註冊
router.post('/users', userController.signUp)
// 錯誤處理
router.use('/', apiErrorHandler)

module.exports = router
