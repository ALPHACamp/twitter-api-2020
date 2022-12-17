const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const { authenticated } = require('../middleware/auth')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const admin = require('./modules/admin')

const { generalErrorHandler } = require('../middleware/error-handler')

router.use('/admin', admin)

router.post('/login', passport.authenticate('local', { session: false }), userController.logIn)

router.get('/users/:id/likes', authenticated, userController.getUserlikes)
router.get('/users/:id/tweets', authenticated, userController.getUserTweets)
router.get('/users/:id/replied_tweets', authenticated, userController.getUserReplidTweets)

router.get('/users/:id/followings', authenticated, userController.getUserFollowing)
router.get('/users/:id/followers', authenticated, userController.getUserFollower)
router.get('/users/:id', authenticated, userController.getUser)
router.put('/users/:id', authenticated, userController.putUser)
router.post('/users', userController.postUsers)


router.post('/users', userController.postUsers)
router.get('/auth', authenticated, (req, res) => res.status(200).json({ status: '200', message: 'JWT success' }))

router.post('/users', authenticated, userController.postUsers)

router.get('/tweets/:id/replies', authenticated, tweetController.getTweetReplies)
// router.post('/tweets/:id/replies', authenticated, tweetController.postTweetReply)
router.get('/tweets/:id', authenticated, tweetController.getTweet)
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweets)

router.get('/', (req, res) => res.send('Hello World!'))

router.use('/', generalErrorHandler)

module.exports = router
