const express = require('express')
const router = express.Router()
const userController = require('../../controllers/user-controller')
const { authenticated } = require('../../middleware/auth')

router.get('/:id/replied_tweets', authenticated, userController.getUserReplies)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id/likes', authenticated, userController.getUserLikes)
router.get('/:id', authenticated, userController.getUserProfile)
router.post('/', userController.signUp)
module.exports = router
