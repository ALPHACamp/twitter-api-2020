const express = require('express')
const router = express.Router()
const adminController = require('../../controllers/adminController')
const { authenticated, authenticatedRole } = require('../../middlewares/auth')

// Get all users except admin
router.get('/users', authenticated, authenticatedRole('admin'), adminController.getUsers)

// Get all tweets
router.get('/tweets', authenticated, authenticatedRole('admin'), adminController.getTweets)

// Delete certain tweet
router.delete('/tweets/:id', authenticated, authenticatedRole('admin'), adminController.deleteTweet)

module.exports = router
