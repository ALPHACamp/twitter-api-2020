const express = require('express')
const router = express.Router()
const passport = require('../config/passport')
const admin = require('./modules/admin')
const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')
const upload = require('../middleware/multer')
const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const replyController = require('../controllers/replyController')
const followController = require('../controllers/followController')

router.use('/admin', authenticatedAdmin, admin)

// 告訴passport不用session了 改用token驗證
router.post('/signin', passport.authenticate('local', { session: false, failureMessage: true }), userController.signIn)
router.get('/users/top', authenticated, userController.getTopUsers)
// like
router.post('/tweets/:id/like', authenticated, followController.addLike)
router.post('/tweets/:id/unlike', authenticated, followController.removeLike)
router.get('/users/:id/likes', authenticated, followController.getLikes)
router.post('/followships', authenticated, followController.addFollowing)
router.delete('/followships/:id', authenticated, followController.removeFollowing)
router.get('/users/:id/followers', authenticated, followController.getFollowers)
router.get('/users/:id/followings', authenticated, followController.getFollowings)
router.get('/users/:id/follow_counts', authenticated, followController.getFollowCounts)

// reply
router.get('/tweets/:id/replies', authenticated, replyController.getReplies)
router.post('/tweets/:id/replies', authenticated, replyController.postReply)
router.put('/replies/:id', authenticated, replyController.putReply)
router.delete('/replies/:id', authenticated, replyController.deleteReply)

// tweet
router.get('/users/:id/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.get('/users/:id/replied_tweets', authenticated, tweetController.getRepliedTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.put('/tweets/:id', authenticated, tweetController.putTweet)
router.delete('/tweets/:id', authenticated, tweetController.deleteTweet)

// user
router.post('/users', userController.signUp)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id',
  upload.fields([
    { name: 'avatar', maxCount: 1 },
    { name: 'coverPhoto', maxCount: 1 }
  ]), authenticated, userController.putUser)
router.delete('/users/:id', authenticated, userController.deleteUser)

router.use('/', apiErrorHandler)
module.exports = router
