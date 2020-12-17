const express = require('express')
const passport = require('../config/passport')
const helper = require('../_helpers')
const router = express.Router()

const adminController = require('../controllers/api/adminController')
const tweetController = require('../controllers/api/tweetController')
const replyController = require('../controllers/api/replyController')
const userController = require('../controllers/api/userController')

const authenticated = passport.authenticate('jwt', { session: false })
const authenticatedAdmin = (req, res, next) => {
  if (helper.getUser) {
    if (helper.getUser.role === 'admin') {
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied.' })
  }
  return res.json({ status: 'error', message: 'permission denied.' })
}

// adminController
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.removeTweet)

// tweetController
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.post('/tweets', authenticated, tweetController.addTweet)
router.put('/tweets/:id', authenticated, tweetController.updateTweet)
router.delete('/tweets/:id', authenticated, tweetController.removeTweet)
router.post('/tweets/:id/like', authenticated, tweetController.likeTweet)
router.delete('/tweets/:id/unlike', authenticated, tweetController.unlikeTweet)

// replyController
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReplies)
router.post('/tweets/:tweet_id/replies', authenticated, replyController.addReply)
router.put('/tweets/:tweet_id/replies', authenticated, replyController.updateReply)
router.delete('/tweets/:tweet_id/replies', authenticated, replyController.removeReply)

// userController
router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/users', authenticated, userController.getCurrentUser)
router.get('/users/top', authenticated, userController.getTopUsers)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, userController.updateUser)
router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, userController.getLikedTweets)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.post('/followships', authenticated, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, userController.removeFollowing)

module.exports = router
