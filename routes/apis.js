const express = require('express')
const router = express.Router()

const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const userController = require('../controllers/userController')
const tweetController = require('../controllers/tweetController')

// route : login
router.post('/login', userController.login)
router.post('/users', userController.register)
// route : tweets
router.get('/tweets', authenticated, tweetController.getTweets)
router.post('/tweets', authenticated, tweetController.postTweet)
router.get('/tweets/:tweet_Id', authenticated, tweetController.getTweet)

module.exports = router
