const express = require('express')
const router = express.Router()
const passport = require('../config/passport')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

const adminController = require('../controllers/api/adminController')
const followController = require('../controllers/api/followController')
const likeController = require('../controllers/api/likeController')
const replyController = require('../controllers/api/replyController')
const tweetController = require('../controllers/api/tweetController')
const userController = require('../controllers/api/userController')
const helpers = require('../_helpers')


const authenticated = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    let helperGetUser = helpers.getUser(req)

    if (!user) {
      return res.json({ status: 'error', message: 'permission denied' })
    }
    if (user.role !== 'admin') {
      helperGetUser = user
      req.user = helperGetUser
      return next()
    }
    return res.json({ status: 'error', message: 'permission denied' })
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    let helperGetUser = helpers.getUser(req)

    if (user) {
      if (user.role === 'admin' || helperGetUser.role === 'admin') {
        helperGetUser = user
        req.user = helperGetUser
        return next()
      }
      return res.json({ status: 'error', message: 'permission denied' })
    } else {
      return res.json({ status: 'error', message: 'permission denied' })
    }
  })(req, res, next)


}

// User
router.post('/users', userController.signUp)
router.post('/users/signin', userController.signIn)
router.get('/users', authenticated, userController.getTopUser)
router.get('/users/:id', authenticated, userController.getUser)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/users/:id/likes', authenticated, userController.getUserLikes)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/edit', authenticated, userController.editUser)
router.put('/users/:id', authenticated, upload.any('avatar', 'cover'), userController.putUser)


// admin
router.post('/admin/signin', adminController.signIn)
router.get('/admin/users', authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticatedAdmin, adminController.deleteTweets)

// tweet
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.get('/tweets/:id', authenticated, tweetController.getTweet)

// follow
router.post('/followships', authenticated, followController.addFollowing)
router.delete('/followships/:followingId', authenticated, followController.removeFollowing)

// Like
router.post('/tweets/:id/like', authenticated, likeController.addLike)
router.post('/tweets/:id/unlike', authenticated, likeController.removeLike)

// Reply
router.post('/tweets/:tweet_id/replies', authenticated, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, replyController.getReplies)

module.exports = router