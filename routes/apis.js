const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const uploadProfile = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'cover', maxCount: 1 }])

// authenticated
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')
const followshipController = require('../controllers/followshipController')
// routes: login & register
router.post('/login', userController.login)
router.post('/users', userController.register)
// routes : users
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, uploadProfile, userController.putUser)
router.get('/users/:id/tweets', authenticated, userController.getTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, userController.getLikedTweets)
router.get('/users/:id/followers', authenticated, userController.getFollowers)
router.get('/users/:id/followings', authenticated, userController.getFollowings)
// routes : tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:tweet_Id/replies', authenticated, tweetController.getReplies)
router.post('/tweets/:tweet_Id/replies', authenticated, tweetController.postReply)
router.post('/tweets/:tweet_Id/like', authenticated, tweetController.tweetLike)
router.post('/tweets/:tweet_Id/unlike', authenticated, tweetController.tweetUnlike)
router.get('/tweets/:tweet_Id', authenticated, tweetController.getTweet)
// routes : followships
router.post('/followships/:userId', authenticated, followshipController.addFollowing)
router.delete('/followships/:userId', authenticated, followshipController.removeFollowing)



module.exports = router
