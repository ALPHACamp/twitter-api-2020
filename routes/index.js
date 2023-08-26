const express = require('express')
const router = express.Router()

const tweets = require('./modules/tweets')

const passport = require('../config/passport')
const apiErrorHandler = require('../middleware/error-handler')
const upload = require('../middleware/multer')
const { authenticator, authenticatorAdmin } = require('../middleware/api-auth')

const userController = require('../controllers/user-controller')

router.post('/users', userController.signUp, userController.signIn) // No.1 - 註冊帳號
router.post('/users/signin', passport.authenticate('local', { session: false, failWithError: true }), userController.signIn) // No.2 - 登入前台帳號

// users相關路由
router.get('/users/:id', authenticator, userController.getUser) // No.3 - 查看某使用者的資料
router.get('/users/:id/tweets', authenticator, userController.getUserTweets) // No.4 - 查看某使用者發過的推文
router.get('/users/:id/replied_tweets', authenticator, userController.getUserReplies) // No.5 - 查看某使用者發過的回覆
router.get('/users/:id/likes', authenticator, userController.getUserLikes) // No.6 - 查看某使用者點過like的推文
router.get('/users/:id/followings', authenticator, userController.getUserFollowings) // No.7 - 查看某使用者追蹤中的人
router.get('/users/:id/followers', authenticator, userController.getUserFollowers) // No.8 - 查看某使用者的追隨者
router.get('/users', authenticator, userController.getUsers) // No.9 - 查看跟隨者數量排名(前10)的使用者資料
router.put('/users/:id', authenticator, upload.fields([{ name: 'avatar' }, { name: 'banner' }]), userController.putUser) // No.10 - 編輯使用者資料

router.use('/tweets', authenticator, tweets)

router.use('/', (req, res) => res.status(500).json({ success: false, message: 'no such api' })) // fallback路由
router.use('/', apiErrorHandler) // 錯誤處理

module.exports = router
