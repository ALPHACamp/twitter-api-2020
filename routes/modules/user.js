const express = require('express')
const router = express.Router()

const userController = require('../../controllers/user-controller')

router.get('/:userId/tweets', authenticatedUser, userController.getUserTweets)
router.get(
  '/:userId/replied_tweets', userController.getUserReplies)

router.post('/', userController.signUp)

module.exports = router
