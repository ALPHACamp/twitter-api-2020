const express = require('express')
const router = express.Router()

const tweetController = require('../controllers/tweetController')

// Tweets
router.get('/', (req, res) => res.redirect('tweets'))
router.get('/tweets', tweetController.getTweets)

module.exports = router
