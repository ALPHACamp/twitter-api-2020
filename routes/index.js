const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
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

// 取得指定使用者追隨中的所有使用者 & 取得追隨指定使用者的所有使用者
// router.get('/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
// router.get('/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)

// 取得目前登入的使用者資料
router.get('/current_user', authenticated, authenticatedUser, getCurrentUser)

// 取得指定使用者資料
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)

// 修改目前登入的使用者設定
router.put('/users/:id/setting', authenticated, authenticatedUser, userController.putUserSetting)

// 修改目前登入的使用者個人頁面
router.put('/users/:id', authenticated, authenticatedUser, userController.putUser)

// // 目前登入使用者資料的上傳單張圖片至個人頭像
// router.put('/users/:id', upload.single('avatar'), userController.putUser)

// // 目前登入使用者資料的上傳單張圖片至個人背景
// router.put('/users/:id', upload.single('cover'), userController.putUser)

// Tweet APIs
router.get('/tweets/:tweet_id', tweetController.getTweet)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)

router.use('/', apiErrorHandler)

module.exports = router
