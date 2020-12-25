const express = require('express')
const passport = require('../config/passport')
const helper = require('../_helpers')
const multer = require('multer')
const router = express.Router()
const upload = multer({ dest: 'uploads/' })

const adminController = require('../controllers/api/adminController')
const tweetController = require('../controllers/api/tweetController')
const replyController = require('../controllers/api/replyController')
const userController = require('../controllers/api/userController')

const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) return next(err)
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'permission denied.' })
    }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (helper.getUser(req).role !== 'admin') {
    return res.status(401).json({ status: 'error', message: 'permission denied.' })
  }
  return next()
}

const authenticatedUser = (req, res, next) => {
  if (helper.getUser(req).role === 'admin') {
    return res.status(401).json({ status: 'error', message: 'permission denied.' })
  }
  return next()
}

// adminController
router.post('/admin/signin', adminController.signIn)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.removeTweet)

// tweetController
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.get('/tweets/:id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/tweets', authenticated, authenticatedUser, tweetController.addTweet)
router.put('/tweets/:id', authenticated, authenticatedUser, tweetController.updateTweet)
router.delete('/tweets/:id', authenticated, authenticatedUser, tweetController.removeTweet)
router.post('/tweets/:id/like', authenticated, authenticatedUser, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.unlikeTweet)

// replyController
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getReplies)
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.addReply)
router.put('/tweets/:tweet_id/replies/:reply_id', authenticated, authenticatedUser, replyController.updateReply)
router.delete('/tweets/:tweet_id/replies/:reply_id', authenticated, authenticatedUser, replyController.removeReply)

// userController
router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/users', authenticated, authenticatedUser, userController.getCurrentUser)
router.get('/users/top', authenticated, authenticatedUser, userController.getTopUsers)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.put('/users/:id', authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.updateUser)
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, authenticatedUser, userController.getLikedTweets)
router.get('/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)
router.get('/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)
router.post('/followships', authenticated, authenticatedUser, userController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedUser, userController.removeFollowing)

module.exports = router
