const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')

// router.get('/:id/likes', userController.getUserLikes)
router.get('/:id/replied_tweets', userController.getUserRepliedTweets)
router.get('/:id/tweets', userController.getUserTweets)
router.get('/:id', userController.getUser)

module.exports = router