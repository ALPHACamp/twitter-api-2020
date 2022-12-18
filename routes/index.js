const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const user = require('./modules/user')
const tweet = require('./modules/tweet')
const userController = require('../controllers/user-controller')
const replyController = require('../controllers/reply-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

// tweet功能
router.use('/tweets', authenticated, authenticatedUser, tweet)
// user功能
router.use('/users', authenticated, authenticatedUser, user)
// 取得當前使用者
router.get('/current_user', userController.getCurrentUser)
// 後台登入
router.post('/admin/signin', passport.authenticate('local', { session: false }), authenticatedAdmin, userController.signIn)
// 後台功能路由
router.use('/admin', authenticated, authenticatedAdmin, admin)
// 前台註冊
router.post('/users', userController.signUp)
// 前台登入
router.post('/signin', passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)

// Followship
router.delete('/followships/:followingId', authenticated, authenticatedUser, userController.removeFollowing)
router.post('/followships', authenticated, authenticatedUser, userController.addFollowing)

// Reply
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getReplies)
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.postReply)

router.use('/', (req, res) => {
  res.json('api test main')
})

module.exports = router
