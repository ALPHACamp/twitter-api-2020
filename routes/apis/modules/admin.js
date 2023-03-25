const express = require('express')
const router = express.Router()
// const passport = require('passport')

const adminController = require('../../../controllers/admin-controller')

router.get('/users', adminController.getUsers)

router.get('/tweets', adminController.getTweets)
router.delete('/tweets/:tweetId', adminController.deleteTweet)

module.exports = router
