const express = require('express')
const router = express.Router()
const { authenticated } = require('../../middleware/auth')
const userController = require('../../controllers/user-controller')
const likeController = require('../../controllers/like-controller')
const replyController = require('../../controllers/reply-controller')

router.get('/:id/likes', authenticated, likeController.getUserLikes)
router.get('/:id/replies', authenticated, replyController.getUserReplies)
router.get('/:id/tweets', authenticated, userController.getUserTweets)
router.get('/:id', authenticated, userController.getUser)

module.exports = router