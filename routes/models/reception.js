const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const tweetController = require('../../controllers/tweet-controller')
const replyController = require('../../controllers/reply-controller')
const likeControler = require('../../controllers/like-controller')
const followshipController = require('../../controllers/followship-controller')
const upload = require('../../middleware/multer')

// 喜歡相關路由
router.post('/tweets/:id/like', likeControler.add)
router.post('/tweets/:id/unlike', likeControler.remove)

// 推文相關路由
router.get('/tweets/:id', tweetController.getOne)
router.get('/tweets', tweetController.getAll)
router.post('/tweets', tweetController.create)

// 回覆相關路由
router.post('/tweets/:tweet_id/replies', replyController.create)
router.get('/tweets/:tweet_id/replies', replyController.getAll)
router.post('/replies/:id/like/:tweetId', replyController.add)
router.post('/replies/:id/unlike/:tweetId', replyController.remove)

// 追蹤相關路由
router.delete('/followships/:followingId', followshipController.deleteFollowship)
router.post('/followships', followshipController.postFollowship)

// 使用者相關路由
router.get('/users/:id/tweets', userController.getUserTweet)
router.get('/users/:id/replied_tweets', userController.userRepliedTweets)
router.get('/users/:id/likes', userController.userLikes)
router.get('/users/:id/followings', userController.userFollowings)
router.get('/users/:id/followers', userController.userFollowers)
router.get('/users/topFollowedUser', userController.getTopUsers)
router.get('/users/:id', userController.getUser)
router.put('/users/:id', upload.fields([{ name: 'cover', maxCount: 1 }, { name: 'avatar', maxCount: 1 }]), userController.putUser)

module.exports = router
