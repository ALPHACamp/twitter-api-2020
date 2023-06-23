const express = require('express')
const router = express.Router()
const passport = require('../../config/passport')

const adminController = require('../../controllers/admin-controller')
const { isAdmin, authenticatedAdmin } = require('../../middleware/auth')

router.get('/users', adminController.getAllUsers)
router.get('/tweets', adminController.getAllTweets)
router.delete('/tweets/:tweetId', adminController.deleteTweet)

module.exports = router
