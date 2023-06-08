const express = require('express')
const router = express.Router()

const passport = require('../config/passport')

const userController = require('../controllers/user-controller')
const tweetController = require('../controllers/tweet-controller')

const { authenticatedAdmin, authenticatedUser, authenticated } = require('../middleware/auth')
const { generalErrorHandler } = require('../middleware/error-handler')
const cors = require('../middleware/cors')

router.post('/api/users/signin', cors, passport.authenticate('local', { session: false }), authenticatedUser, userController.signIn)
router.post('/api/admin/signin', cors, passport.authenticate('local', { session: false }), authenticatedAdmin, userController.signIn)

router.post('/api/users', cors, userController.signUp)

router.get('/api/users/:id', cors, authenticated, authenticatedUser, userController.getUser)
router.get('/api/users/:id/tweets', cors, authenticated, authenticatedUser, userController.getUserTweets)

router.post('/api/tweets/:id/like',cors, authenticated, authenticatedUser, tweetController.addLike)
router.post('/api/tweets/:id/unlike',cors, authenticated, authenticatedUser, tweetController.removeLike)

router.get('/api/tweets/:id',cors, authenticated, authenticatedUser, tweetController.getTweet)
router.get('/api/tweets', cors, authenticated, authenticatedUser, tweetController.getTweets)
router.post('/api/tweets', cors, authenticated, tweetController.postTweets)

// router.get('/api/tweets/:id', tweetController.getTweet)
// router.get('/api/tweets', tweetController.getTweets)
// router.post('/api/tweets', cors, authenticated, tweetController.postTweets)

router.use('/', cors, generalErrorHandler)

module.exports = router