const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middlewares/auth')

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const likeController = require('../controllers/likeController')
const replyController = require('../controllers/replyController')
const followshipController = require('../controllers/followshipController')

const multer = require('multer')
const upload = multer({ dest: 'temp/' })

//user
router.post('/users', userController.signUP)
router.post('/signin', userController.signIn)
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getTweets)
router.get('/users/currentUser', authenticated, authenticatedUser, userController.getCurrentUser)
router.get('/users/topUsers', authenticated, authenticatedUser, userController.getTopUsers)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getRepliedTweets)
router.put('/users/:id/edit', authenticated, authenticatedUser, userController.editUser)
router.put('/users/:id', authenticated, authenticatedUser, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }]), userController.putUser)
router.get('/users/:id/likes', authenticated, authenticatedUser, userController.getLikes)
router.get('/users/:id/followers', authenticated, authenticatedUser, userController.getFollowers)
router.get('/users/:id/followings', authenticated, authenticatedUser, userController.getFollowings)

//tweet
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)

//like
router.post('/tweets/:tweet_id/unlike', authenticated, authenticatedUser, likeController.unlikeTweet)
router.post('/tweets/:tweet_id/like', authenticated, authenticatedUser, likeController.likeTweet)

//reply
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.addReply)
router.get('/tweets/:tweet_id/replies', authenticated, authenticatedUser, replyController.getReplies)

//followship
router.post('/followships', authenticated, authenticatedUser, followshipController.postFollowship)
router.delete('/followships/:followingId', authenticated, authenticatedUser, followshipController.deleteFollowship)

//admin
router.post('/admin/signin', adminController.signIn)
router.get('/admin', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)
router.get('/admin/users/currentUser', authenticated, authenticatedAdmin, adminController.getCurrentUser)

module.exports = router