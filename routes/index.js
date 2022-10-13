const express = require('express')
const router = express.Router()
const passport = require('passport')
const admin = require('./modules/admin')
const adminController = require('../controllers/admin-controller')
const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')
const followshipController = require('../controllers/followship-controller')
const { errorHandler } = require('../middleware/error-handler')
const { authenticated, authAdmin, authUser } = require('../middleware/auth')
const upload = require('../middleware/multer')

// admin
router.post('/admin/signin', passport.authenticate('local', { session: false }), adminController.signin)
router.use('/admin', authenticated, authAdmin, admin)

// user
router.get('/users/current_user', authenticated, authUser, userController.currentUser)
router.get('/users/top', authenticated, authUser, userController.getTopUsers)
router.get('/users/:id/tweets', authenticated, authUser, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, authUser, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, authUser, userController.getLikes)
router.get('/users/:id/followings', authenticated, authUser, userController.getFollowings)
router.get('/users/:id/followers', authenticated, authUser, userController.getFollowers)
router.get('/users/:id', authenticated, authUser, userController.getUser)
router.put('/users/:id', authenticated, authUser, upload.fields([{ name: 'image', maxCount: 1 }, { name: 'backgroundImage', maxCount: 1 }]), userController.putUser)
router.post('/signin', passport.authenticate('local', { session: false }), userController.signin)
router.post('/users', userController.signup)

// tweet
router.get('/tweets/:id', authenticated, authUser, tweetController.getTweet)
router.get('/tweets', authenticated, authUser, tweetController.getTweets)
router.post('/tweets', authenticated, authUser, tweetController.postTweet)

// replies
router.post('/tweets/:tweet_id/replies', authenticated, authUser, tweetController.postRepliedTweet)
router.get('/tweets/:tweet_id/replies', authenticated, authUser, tweetController.getRepliedTweet)

// likes
router.post('/tweets/:id/like', authenticated, authUser, tweetController.likeTweet)
router.post('/tweets/:id/unlike', authenticated, authUser, tweetController.unlikeTweet)

// followship
router.post('/followships', authenticated, authUser, followshipController.postFollowing)
router.delete('/followships/:followingId', authenticated, authUser, followshipController.deleteFollowing)

// error handler
router.use('/', errorHandler)

module.exports = router
