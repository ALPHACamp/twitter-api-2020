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

const authenticated = function (req, res, next) {
  passport.authenticate('jwt', { session: false }, function (err, user, info) {
    if (err) { return next(err) }
    if (!user) { return res.status(401).json({ status: 'error', message: 'authentication error' }) }
    req.user = user
    return next()
  })(req, res, next)
}

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.role === 'admin') { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}

// User
router.post('/users', userController.signUp)
router.post('/users/signIn', userController.signIn)
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
router.get('/admin/users', adminController.getUsers)
router.get('/admin/tweets', adminController.getTweets)
router.delete('/admin/tweets/:id', adminController.deleteTweets)

// tweet
router.post('/tweets', tweetController.postTweet)
router.get('/tweets', tweetController.getTweets)
router.get('/tweets/:id', tweetController.getTweet)

// follow
router.post('/followships', followController.addFollowing)
router.delete('/followships/:followingId', followController.removeFollowing)

// Like
router.post('/tweets/:id/like', likeController.addLike)
router.post('/tweets/:id/unlike', likeController.removeLike)

module.exports = router