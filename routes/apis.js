const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const { authenticated, authenticatedAdmin, authenticatedNotAdmin } = require('../middleware/auth.js')

const userController = require('../controllers/userController.js')
const adminController = require('../controllers/adminController.js')
const followshipController = require('../controllers/followshipController.js')
const likeController = require('../controllers/likeController.js')
const tweetController = require('../controllers/tweetController.js')
const replyController = require('../controllers/replyController.js')

// current user
router.get('/current_user', authenticated, userController.getCurrentUser)

// user routes
router.post('/users', userController.signUp)
router.post('/signin', userController.signIn)
router.get('/users/top', authenticated, authenticatedNotAdmin, userController.getTopFollowedUsers)
router.get('/users/:id', authenticated, authenticatedNotAdmin, userController.getUser)
router.get('/users/:id/likes', authenticated, authenticatedNotAdmin, userController.getLikedTweets)
router.get('/users/:id/replied_tweets', authenticated, authenticatedNotAdmin, userController.getReplies)
router.get('/users/:id/tweets', authenticated, authenticatedNotAdmin, userController.getTweets)
router.get('/users/:id/followings', authenticated, authenticatedNotAdmin, userController.getFollowings)
router.get('/users/:id/followers', authenticated, authenticatedNotAdmin, userController.getFollowers)
router.put('/users/:id', authenticated, authenticatedNotAdmin,
  upload.fields([{ name: 'avatar', max: 1 }, { name: 'cover', max: 1 }]), userController.putUser)
router.put('/users/:id/edit', authenticated, authenticatedNotAdmin, userController.editUser)
router.delete('/users/:id/cover', authenticated, authenticatedNotAdmin, userController.removeCover)

// admin routes
router.post('/admin/signin', adminController.signIn)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/admin/tweets', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)

// followship routes
router.post('/followships', authenticated, authenticatedNotAdmin, followshipController.addFollowing)
router.delete('/followships/:followingId', authenticated, authenticatedNotAdmin, followshipController.removeFollowing)

// like route
router.post('/tweets/:id/like', authenticated, authenticatedNotAdmin, likeController.addLike)
router.post('/tweets/:id/unlike', authenticated, authenticatedNotAdmin, likeController.removeLike)

// tweet routes
router.get('/tweets', authenticated, authenticatedNotAdmin, tweetController.getTweets)
router.get('/tweets/:id', authenticated, authenticatedNotAdmin, tweetController.getTweet)
router.post('/tweets', authenticated, authenticatedNotAdmin, tweetController.postTweet)

// reply routes
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedNotAdmin, replyController.postReply)
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedNotAdmin, replyController.getReplies)

module.exports = router
