const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const upload = require('../middleware/multer')
const { apiErrorHandler } = require('../middleware/error-handler')

const { authenticated, authenticatedUser } = require('../middleware/auth')

const admin = require('./modules/admin')

router.use('/admin', admin)

// 註冊/登入
router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// 取得前十名最多追蹤者的使用者
router.get('/users/top', authenticated, userController.getTopUsers)

// 取得目前登入的使用者資料
router.get('/current_user', authenticated, userController.getCurrentUser)

// 取得特定使用者的所有推文、回覆、like資料
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getUsersTweets)
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getUsersReplies)
router.get('/users/:id/likes', authenticated, authenticatedUser, userController.getUsersLikes)

// 修改目前登入的使用者設定
router.put('/users/:id/setting', authenticated, authenticatedUser, userController.putUserSetting)

// 修改目前登入的使用者個人頁面
router.put('/users/:id', authenticated, upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUser)

// 取得指定使用者追隨中的所有使用者 & 取得追隨指定使用者的所有使用者
router.get('/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.get('/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)

// 取得指定使用者資料 （往後放到最後囉）
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)

// Tweet APIs
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.getTweetReplies)
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.postTweetReply)
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/tweets/:id/like', authenticated, authenticatedUser, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.addUnlike)

router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)

// Followship APIs
router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:id', authenticated, userController.removeFollowing)

router.use('/', apiErrorHandler)

module.exports = router
