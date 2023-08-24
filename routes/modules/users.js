const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id', userController.getUser)

router.get('/:id/tweets', userController.getUserTweets)

module.exports = router
