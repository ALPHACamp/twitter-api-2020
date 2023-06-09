const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const followController = require('../controllers/followController')

router.use('/admin', authenticatedAdmin, admin)

// 告訴passport不用session了 改用token驗證
router.post('/signin', passport.authenticate('local', { session: false }), userController.signIn)

router.post('/tweets/:id/like', authenticated, followController.addLike)
router.delete('/tweets/:id/unlike', authenticated, followController.removeLike)
router.post('/followships', authenticated, followController.addFollowing)
router.delete('/followships/:id', authenticated, followController.removeFollowing)
router.get('/users/:id/likes', authenticated, followController.getLikes)
router.get('/users/:id/followers', authenticated, followController.getFollowers)
router.get('/users/:id/followings', authenticated, followController.getFollowings)
router.get('/users/:id/follow_counts', authenticated, followController.getFollowCounts)

router.get('/tweets/:id/replies', authenticated, replyController.getReplies)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.put('/tweets/:tweet_id/replies/:reply_id', authenticated, replyController.putReply)
router.delete('/tweets/:tweet_id/replies/:reply_id', authenticated, replyController.deleteReply)

router.get('/users/:id/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.get('/users/:id/replied_tweets', authenticated, tweetController.getRepliedTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.put('/tweets/:id', authenticated, tweetController.putTweet)
router.delete('/tweets/:id', authenticated, tweetController.deleteTweet)

router.get('/users/top', authenticated, userController.getTopUsers)
router.post('/users', userController.signUp)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, userController.putUser)
router.delete('/users/:id', authenticated, userController.deleteUser)

router.use('/', apiErrorHandler)
module.exports = router
