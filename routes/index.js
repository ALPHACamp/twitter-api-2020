const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const upload = require('../middleware/multer')
const tweetController = require('../controllers/tweet-controller')
const { apiErrorHandler } = require('../middleware/error-handler')

// 尚未加入 authenticatedAdmin
const { authenticated, authenticatedUser } = require('../middleware/auth')
const { getCurrentUser } = require('../controllers/user-controller')

// 註冊/登入
router.post('/users', userController.signUp)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

// 取得前十名最多追蹤者的使用者
router.get('/users/top', authenticated, userController.getTopUsers)

// 取得目前登入的使用者資料
router.get('/current_user', authenticated, authenticatedUser, getCurrentUser)

// 取得特定使用者的所有推文
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getUsersTweets)

// 取得指定使用者資料 （這條可能要往後放喔，不然資料很容繼跑進這條裡就不往後面跑了！）
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)

// 修改目前登入的使用者設定
router.put('/users/:id/setting', authenticated, authenticatedUser, userController.putUserSetting)

// 目前登入使用者資料的上傳單張圖片路由
// router.put('/users/:id', upload.single('image'), userController.putUserSetting)

// 修改目前登入的使用者個人頁面
router.put('/api/users/:id', authenticated, authenticatedUser, userController.putUser)

// Tweet APIs
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.getTweetReplies)
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.postTweetReply)
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)

router.use('/', apiErrorHandler)

module.exports = router
