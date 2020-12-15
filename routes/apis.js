const express = require('express')
const router = express.Router()

const adminController = require('../controllers/api/adminController')
const tweetController = require('../controllers/api/tweetController')
const replyController = require('../controllers/api/replyController')
const userController = require('../controllers/api/userController')

// adminController
router.get('/admin/users', adminController.getUsers)
router.get('/admin/tweets', adminController.getTweets)
router.delete('/admin/tweets/:id', adminController.removeTweet)

// tweetController
router.get('/tweets', tweetController.getTweets)
router.get('/tweets/:id', tweetController.getTweet)
router.post('/tweets', tweetController.addTweet)
router.put('/tweets/:id', tweetController.updateTweet)
router.delete('/tweets/:id', tweetController.removeTweet)
router.post('/tweets/:id/like', tweetController.likeTweet)
router.delete('/tweets/:id/unlike', tweetController.unlikeTweet)

// replyController
router.get('/tweets/:tweet_id/replies', replyController.getReplies)
router.post('/tweets/:tweet_id/replies', replyController.addReply)
router.put('/tweets/:tweet_id/replies', replyController.updateReply)
router.delete('/tweets/:tweet_id/replies', replyController.removeReply)

// userController
router.post('/users', userController.signUp)
router.post('/users', userController.signIn)
router.get('/users', userController.getCurrentUser)
router.get('/users/top', userController.getTopUsers)
router.get('/users/:id', userController.getUser)
router.put('/users/:id', userController.updateUser)
router.get('/users/:id/tweets', userController.getTweets)
router.get('/users/:id/replied_tweets', userController.getRepliedTweets)
router.get('/users/:id/likes', userController.getLikedTweets)
router.get('/users/:id/followings', userController.getFollowings)
router.get('/users/:id/followers', userController.getFollowers)
router.post('/followships', userController.addFollowing)
router.delete('/followships/:followingId', userController.removeFollowing)

module.exports = router
