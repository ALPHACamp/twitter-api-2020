const express = require('express')
const router = express.Router()
const { authenticated, authenticatedUser, authenticatedAdmin } = require('../middlewares/auth')

const userController = require('../controllers/userController')
const adminController = require('../controllers/adminController')
const tweetController = require('../controllers/tweetController')
const followshipController = require('../controllers/followshipController')

router.get('/', authenticated, authenticatedUser, (req, res) => res.send('test'))

//user
router.post('/users', userController.signUP)
router.post('/signin', userController.signIn)
router.get('/users/:id/tweets', authenticated, authenticatedUser, userController.getTweets)
router.get('/users/currentUser', authenticated, authenticatedUser, userController.getCurrentUser)
router.get('/users/:id', authenticated, authenticatedUser, userController.getUser)
router.get('/users/:id/replied_tweets', authenticated, authenticatedUser, userController.getRepliedTweets)
router.get('/users/:id/likes', authenticated, authenticatedUser, userController.getLikes)

//tweet
router.get('/tweets', authenticated, authenticatedUser, tweetController.getTweets)
router.post('/tweets', authenticated, authenticatedUser, tweetController.postTweet)
router.get('/tweets/:tweet_id', authenticated, authenticatedUser, tweetController.getTweet)
router.post('/tweets/:id/unlike', authenticated, authenticatedUser, tweetController.unlikeTweet)
router.post('/tweets/:id/like', authenticated, authenticatedUser, tweetController.likeTweet)
router.post('/tweets/:tweet_id/replies', authenticated, authenticatedUser, tweetController.addReply)


//followship
router.post('/followships', authenticated, authenticatedUser, followshipController.postFollowship)

//admin
router.post('/admin/signin', adminController.signIn)
router.get('/admin', authenticated, authenticatedAdmin, adminController.getTweets)
router.delete('/admin/tweets/:id', authenticated, authenticatedAdmin, adminController.deleteTweet)
router.get('/admin/users', authenticated, authenticatedAdmin, adminController.getUsers)

module.exports = router