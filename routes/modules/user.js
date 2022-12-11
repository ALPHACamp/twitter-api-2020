const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id', userController.getUserProfile)

module.exports = router
