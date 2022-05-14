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

// 取得指定使用者資料
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)

// 修改目前登入的使用者設定
router.put('/users/:id/setting', authenticated,  authenticatedUser, userController.putUserSetting)

// 目前登入使用者資料的上傳單張圖片路由
// router.put('/users/:id', upload.single('image'), userController.putUserSetting)

// 修改目前登入的使用者個人頁面
router.put('/api/users/:id', authenticated, authenticatedUser, userController.putUser)

// Tweet APIs
router.get('/tweets/:tweet_id', tweetController.getTweet)
router.get('/tweets', tweetController.getTweets)
router.post('/tweets', tweetController.postTweet)

router.use('/', apiErrorHandler)

module.exports = router
