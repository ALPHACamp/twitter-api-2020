const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/apis/admin-controller')

router.delete('/api/tweets/:tweetId', adminController.deleteTweet)
router.get('/api/users', adminController.getUsers)
router.get('/api/tweets', adminController.getTweets)

module.exports = router