const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const user = require('./modules/user')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const replyController = require('../controllers/reply-controller')
const { authenticated, authenticatedAdmin, authenticatedUser } = require('../middleware/auth')

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
// Like
router.post('/tweets/:id/like', authenticated, authenticatedUser, tweetController.addLike)
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.removeLike)

// Reply
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getReplies)
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.postReply)

// Tweet
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)

router.use('/', (req, res) => {
  res.json('api test main')
})

module.exports = router
