const express = require('express')
const router = express.Router()

const adminController = require('../../controllers/admin-controller')

router.delete('/tweets/:tweetId', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)
router.get('/users', adminController.getUsers)

module.exports = router
