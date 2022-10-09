const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/admin-controller')

// user
router.get('/users', adminController.getUsers)

// tweet
router.delete('/tweets/:id', adminController.deleteTweet)
router.get('/tweets', adminController.getTweets)

module.exports = router
