const express = require('express')

const router = express.Router()
const passport = require('../config/passport')
// const admin = require('./modules/admin')
const upload = require('../middleware/multer')
const userController = require('../controllers/user-controller')
const adminController = require('../controllers/admin-controller')
const tweet = require('./modules/tweet')
const followship = require('./modules/followship')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

// router.use('/admin', authenticated, authenticatedAdmin, admin)
// admin
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signIn) // 管理者登入
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers) // 看見站內所有的使用者
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet) // 刪除使用者的推文
// users 後續會移進module裡面，怕有更多衝突要解，因此目前還是先放外面等到重構時再移
router.post('/users/signin', passport.authenticate('local', { session: false }), userController.signIn) // 使用者登入
router.post('/users/', userController.signUp) // 註冊

router.get('/users/:id/tweets', authenticated, userController.getUserTweets) // 取得該使用者的所有推文
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies) // 瀏覽某使用者回覆過的留言
router.get('/users/:id/likes', authenticated, userController.getUserLikes) // 瀏覽某使用者點過的 Like
router.get('/users/:id/followings', authenticated, userController.getUserFollowings) // 瀏覽某使用者跟隨中的人
router.get('/users/:id/followers', authenticated, userController.getUserFollowers) // 瀏覽某使用者的跟隨者
router.get('/users/:id/setting', authenticated, userController.getUserSetting) // 瀏覽設定頁面(account, name, email, password)
router.get('/users/:id', authenticated, userController.getUserProfile) // 個人資料頁面(name, introduction, avatar, banner)
router.put('/users/:id/setting', authenticated, userController.putUserSetting) // 編輯設定(account, name, email, password)
router.put('/users/:id', authenticated, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'banner', maxCount: 1 }]), userController.putUserProfile) // 編輯個人資料
// modules
router.use('/followships', authenticated, followship)
router.use('/tweets', authenticated, tweet)

router.use('/', apiErrorHandler)
module.exports = router
