const express = require('express')
const router = express.Router()

const admin = require('./modules/admin')

const userController = require('../controllers/apis/user-controller')
const tweetContorller = require('../controllers/apis/tweet-controller')

const { apiErrorHandler } = require('../middleware/error-handler')
const { authenticated, authenticatedAdmin } = require('../middleware/api-auth')

// api/admin
router.use('/api/admin', authenticated, authenticatedAdmin, admin)
// router.use("/api/admin", admin);

// api/users
// router.get('/api/users', userController.getUsers)
// router.get('/api/signup', userController.signUpPage)
router.post('/api/signup', userController.signUp)

// api/tweets
router.get('/api/tweets/:tweet_id', tweetContorller.getTweet)
router.get('/api/tweets', tweetContorller.getTweets)

// router.get("/restaurants", restController.getRestaurants);
// router.use("/", (req, res) => res.redirect("/restaurants"));

router.use('/', apiErrorHandler)

module.exports = router
