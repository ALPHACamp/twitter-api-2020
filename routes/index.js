const express = require('express')

const router = express.Router()
const passport = require('../config/passport')
// const admin = require('./modules/admin')

const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated } = require('../middleware/api-auth')
const tweet = require('./modules/tweet')

// router.use('/admin', authenticated, authenticatedAdmin, admin)
// admin
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn) // 管理者登入

// users 後續會移進module裡面，怕有更多衝突要解，因此目前還是先放外面等到重構時再移
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn) // 使用者登入
router.post('/users/', userController.signUp) // 註冊

router.get('/users/:id/tweets', authenticated, userController.getUserTweets) // 取得該使用者的所有推文
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies) // 瀏覽某使用者回覆過的留言
router.get('/users/:id/likes', authenticated, userController.getUserLikes) // 瀏覽某使用者點過的 Like
router.get('/users/:id/followings', authenticated, userController.getUserFollowings) // 瀏覽某使用者跟隨中的人
router.get('/users/:id/followers', authenticated, userController.getUserFollowers) // 瀏覽某使用者的跟隨者
router.get('/users/:id', authenticated, userController.getUserProfile) // 個人資料頁面

// modules
router.use('/tweets', authenticated, tweet)

router.use('/', apiErrorHandler)
module.exports = router
