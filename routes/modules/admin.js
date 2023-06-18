const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')
const tweetController = require('../../controllers/tweet-controller')

router.get('/users', adminController.getUsers)
router.get('/tweets', tweetController.getTweets)
router.delete('/tweets/:id', adminController.deleteTweet)

module.exports = router
