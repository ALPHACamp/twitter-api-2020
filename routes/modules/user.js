const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated, authenticatedUser } = require('../../middleware/auth')

router.get('/:id/tweets', authenticated, authenticatedUser, userController.getUserTweets)

module.exports = router
